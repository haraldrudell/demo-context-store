// requestlogger.js
// Log Web server requests
// © Harald Rudell 2012 MIT License

var matcher = require('./matcher')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
var timeUtil = haraldutil.timeUtil
// http://nodejs.org/docs/latest/api/util.html
var util = require('util')

exports.getRequestLogger = getRequestLogger

/*
Get a function for logging requests
opts: object
.logger(string) function
.ignoreHeaders: optional boolean default false (do look at proxy headers)
.matcherList: optional object: options for matcher
.logIncoming: boolean default false
if opts.matcher is missing all requests are logged
*/
function getRequestLogger(opts) {
	if (!opts) opts = {}
	var log = opts.logger || console.log
	return logRequest

	function logRequest(request, res, next) { // uses opts
		var doRequest = !opts.matcherList || matcher.match(opts.matcherList)
		if (doRequest)
			if (opts.logIncoming) writeLog()
			else var t = Date.now()
		next()
		if (doRequest && !opts.logIncoming) writeLog(t)

		// data wanted: utc timestamp, request method, client address, server address, protocol, browser
		function writeLog(t) { // uses request and res

			// get the ip address of the client that issued the request
			var clientIp // '1.2.3.4'
			var clientPort // 80
			var protocol // 'http' or 'https'
			var headers = request.headers
			if (!opts.ignoreHeaders && headers) { // try request headers
				clientIp = headers['x-forwarded-for']
				clientPort = headers['x-forwarded-port']
				protocol = headers['x-forwarded-proto']
			}
			if (!clientIp || !clientPort || !protocol) { // use server socket information
				var socket = request.connection && request.connection.socket || request.socket
				if (!clientIp || !clientPort) {
					clientIp = socket && socket.remoteAddress || '0.0.0.0'
					clientPort = socket && socket.remotePort || 0
				}
				if (!protocol) protocol = socket && socket.server && socket.server.constructor &&
					socket.server.constructor.name === 'HTTPSServer' && 'https' || 'http'
			}

			var output = {
				url: protocol + '://' + // 'http://host.com:3000/page?q=1'
					(headers && headers.host || '0.0.0.0') + (request.url || '/url?'),
				client: clientIp + ':' + clientPort, // '0.0.0.0:0'
			}
			if (t) { // logging on request completed: add duration and status code
				output.duration = (Date.now() - t) /1e3 // number unit s
				output.statusCode = res.statusCode != null ? res.statusCode : 0 // number
			}
			output.time = (t ? new Date(t) : new Date).toISOString() // string utc: "2011-09-30T23:21Z"
			output.method =request.method // method is known to be a non-empty string
			// user agent: use non-empty user-agent header
			output.ua = headers && headers['user-agent'] || '?ua' // string

			log(JSON.stringify(output))
		}
	}
}