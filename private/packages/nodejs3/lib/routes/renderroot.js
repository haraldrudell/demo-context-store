// renderroot.js

var js1 = require('./javascript1.js')

module.exports = {
	getHandler: getHandler,
	redirectToHostHandler: redirectToHostHandler,
	getHost: getHost,
	getJsHandler: getJsHandler,
}

function getHandler(settings) {
	return renderRoot
}

// render the root url for all deployments
function renderRoot(request, response) {
	var host = getHost(request)

	// find possible redirect if deployed to harald.no.de
	var destination
	if (host.host == 'harald.no.de') destination = do301('http://js.haraldrudell.com')

	// execute redirects
	if (destination) {
		renderResponseObject(request, response, destination)
	} else {

		// render the proper page
		if (host.host == 'js.haraldrudell.com') {
			renderJs(response, {
				title: 'JavaScript by Harald Rudell',
				host: host.hostUrl })
		} else {
			response.render('harald', {title: 'Harald Rudell'})
		}
	}
}

function getJsHandler(defaults, view) {
	var title = view.substring(0, 1).toUpperCase() + view.substring(1)
	return function renderJsUrl(request, response) {
		renderJs(response, {
			title: title,
			host: getHost(request).hostUrl,
		})
	}
}
function renderJs(response, opts) {
	if (!opts) opts = {}
	if (!opts.title) opts.title = 'Javascript'
	if (!opts.types) opts.types = js1.getTypes()
	if (!opts.precedence) opts.precedence = js1.precedence()
	if (!opts.host) opts.host = ''
//console.log(arguments.callee.name, opts.precedence)
	response.render('javascript', opts)
}

function renderResponseObject(request, response, destination) {
	response.writeHead(destination.statusCode, destination.headers)
	response.end(request.method != 'HEAD' ? destination.data : undefined)
}

// redirect renderer
function redirectToHostHandler(host) {
	return function(request, response) {
		renderResponseObject(request, response, do301(host))
	}
}

// permanent redirect object
function do301(host) {
	destination = {
		statusCode: 301,
		headers: {
			'Content': 'text/plain',
			'Location': host,
		},
		data: 'Redirecting to ' + host + '...',
	}
	return destination
}

// { host: 'a.com', hostUrl: 'http://a.com:35' }
function getHost(request) {
	var result = {}

	// find how this host was originally addressed by the client
	// note: the reverse proxy already 404:ed the no host case
	var requestHostAndPort = request.headers && request.headers.host || ''

	// protocol: 'http' or 'https'
	var protocol = request.headers && request.headers['x-forwarded-proto']
	if (!protocol) {
		var socket = request.connection && request.connection.socket ||
			request.socket
		protocol = socket && socket.server && (socket.server.constructor.name == 'HTTPSServer' ? 'https' : 'http')
	}

	// hostUrl: used for generating urls
	result.hostUrl = requestHostAndPort ?
		protocol + '://' + requestHostAndPort :
		'' // urls generated in page will be '/index.html'

	result.host = requestHostAndPort.split(':')[0]

	return result
}
