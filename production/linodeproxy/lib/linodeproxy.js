// linodeproxy.js
// Share a port among node instances using name-based routing
// © Harald Rudell 2013 MIT License

/*
forward proxy: issues requests to the Internet from clients that could otherwise not access the servers
reverse proxy: retrieves resources from upstream servers and returns them as they were from the reverse proxy server
open proxy: receives and forwards requests on the Internet

To avoid running Linode Proxy as root, we use iptables to redirect port 80 to 1080:
iptables --table nat --append PREROUTING --in-interface eth0 --protocol tcp --destination-port 80 --jump REDIRECT --to-ports 1080
*/

require = require('apprunner').getRequire(require, exports, {
	api: require('apprunner').getAppData().appName, initApi: initApi,
	ready: false})

var cloner = require('./cloner')
var requestlogger = require('./requestlogger')
var rotatedlogger = require('rotatedlogger')
var neterrorlistener = require('./neterrorlistener')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// http://nodejs.org/docs/latest/api/util.html
var util = require('util')
// https://github.com/nodejitsu/node-http-proxy
var httpProxy = require('http-proxy')

var anomalyFields = ['url', 'statusCode', 'method']

/*
Proxy incoming requests
opts: object
.port: port number on localhost where we receive incoming request
.interface interface
.httpProxyOptions object for http-proxy
.notFound: body util.format string for 404 response
.loggerOpts: optional object

proxy options:
hostnameOnly: boolean, we use true
router: key: hostname a request is directed to
value: string: 'host:port' to where requests for hostname should be redirected
object: routing object or null for 404 error
.statusCode
.headers
.data response body

special handlig: for statusCode 301 and 302, the query string is appended to the location
special han dling:
*/
function initApi(opts) {
	var routingProxy // a value we will receive on the first request for upgrading to websockets
	var appData = apprunner.getAppData({PORT: opts.port, URL: opts.url})

	// request logging: to file only, 1 MiB, monthly rotate
	var requestLog = new rotatedlogger.RotatedLog({
		stdout: false,
		file: true,
		streamOpts: {
			logFile: appData.appId,
		}}).on('error', logErr)
	var loggerFn = requestlogger.getRequestLogger({logger: requestLog.log})

	// start proxying
	var proxy = httpProxy.createServer(cloner.clone(opts.httpProxyOptions), loggerLayer)
		.on('upgrade', addWebsockets)
	proxy.listen(opts.port, opts.interface, appIsUp)

	function loggerLayer(req, res, next) {
		loggerFn(req, res, routeLayer)

		function routeLayer() {
			return proxyFunction(req, res, next)
		}
	}

	/*
	Route an incoming request
	request: IncomingMessage for an http server
	response: ServerResponse for an http server
	next: is a function and a RoutingProxy

	node-http-proxy offers proxy objects that routes using a proxyRequest function
	HttpProxy: has header functions like x-forwarded-for
	RoutingProxy: handles multiple HttpProxy destinations

	in this handler, we can either:
	render to response and return: redirect bad hostnames or not found
	let the RoutingProxy proxy forward the request

	http emits request req res
	node-http-proxy invokes middlewares that arrives here
	*/
	function proxyFunction(request, response, next) {
		if (!routingProxy) routingProxy = next
		neterrorlistener.addListeners({
			request: request,
			response: response,
			emitter: require.emitter})

		/*
		determine how to route this request
		detination: string destination/object redirect/null not found
		we can not use next.proxyTable.getProxyLocation(req), because that code can't do split on an object
		hostname for ip requests is '127.0.0.1', for dns requests: 'server.com'
		*/
		var destination
		var hostName = request.headers && request.headers.host &&
			request.headers.host.split(':')[0] // 'server.com', remove a possible port number
		if (hostName) destination = next.proxyTable.router[hostName]
		else hostName = 'blank host header fields'

		// route to destination
		if (typeof destination === 'string') next() // 'host:port' string, let RoutingProxy dispatch the request
		else {
			if (typeof destination === 'object') { // check for 301 or 302: append uri to the new request
				if ((destination.statusCode === 301 ||
					destination.statusCode === 302) &&
					destination.headers.Location &&
					!destination.noUri) { // a flag disabling this feature
					destination = cloner.clone(destination)
					destination.headers.Location += request.url
				}
			} else { // it is a 404 not found
				destination = { // insert the hostname we can't route into the page
					statusCode: 404,
					headers: {'Content': 'text/html'},
					data: util.format(opts.notFound || '%s', hostName),
				}
			}
			response.writeHead(destination.statusCode, destination.headers)
			response.end(request.method === 'HEAD' ? false : destination.data)
		}
	}

	function addWebsockets(req, socket, head) {
		if (routingProxy) routingProxy.proxyWebSocketRequest(req, socket, head)
	}

	function appIsUp(err) {
		if (err) throw err
		var logArgs = [appData.appName, 'on',
			(opts.interface || 'any') + ':' + opts.port,
			'node', process.version,
			'process', process.pid + '\n' +
			JSON.stringify(opts.httpProxyOptions)]
		console.log.apply(this, logArgs)
	}

	function logErr(err) {
		console.log('Log error:', err, err.stack)
	}

	function requestErrorListener(err) {
		submitAnomaly(this, err, 'request error')
	}
	function responseErrorListener(err) {
		submitAnomaly(this, err, 'response error')
	}
	function submitAnomaly(requestOrResponse, err, slogan) {
		if (!requestOrResponse) requestOrResponse = {}
		var isInstanceofError = err instanceof Error
		var errValue = err

		if (!isInstanceofError) err = new Error('Non-error object')
		var errorProperties = err[require.emitter.id] = {
			slogan: slogan,
			discovery: new Error(arguments.callee.name)
		}
		if (!isInstanceofError) errorProperties.errValue = errValue
		anomalyFields.forEach(addProperties)

		apprunner.anomaly(err)

		function addProperties(p) {
			if (requestOrResponse[p] != null) errorProperties[p] = requestOrResponse[p]
		}
	}
}
