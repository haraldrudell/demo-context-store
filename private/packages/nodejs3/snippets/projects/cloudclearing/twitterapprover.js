// twitterapprover.js
// Produce OAuth access tokens from Twitter
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

require('apprunner').testIntercept({useTestConfig: __dirname})
require = require('apprunner').getRequire(require)

var endserver = require('endserver')
var twitteroauth = require('twitteroauth')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/url.html
var urlm = require('url')
// http://nodejs.org/api/http.html
var http = require('http')

var settings = {
	protocol: 'http',
	hostname: 'localhost',
	interface: 'localhost',
	port: 3990, // we need a fixed port for Twitter to accept us
	approveUri: '/',
	oauthUri: '/',
	deniedUri: '/denied',
	successUri: '/success',
}

var twitterOAuth = new twitteroauth.TwitterOAuth({
	username: 'harud',
	consumerKey: 'kKAlpjvv8Y9k60OEmfp65A',
	consumerSecret: 'DbEX3Tr3SmKsgfn9HOj0kr4yF4607ErIbbqNAfLVs',
})

var serverUrlObject = {
	protocol: settings.protocol,
	hostname: settings.hostname,
	port: settings.port,
}

var endServer = new endserver.EndServer({port: settings.port, interface: settings.interface})
	.on('listening', displayPage)
	.on('request', requestListener)

function displayPage() {
	serverUrlObject.port = endServer.getPort()
	haraldutil.browseTo(urlm.format(haraldutil.merge(serverUrlObject, {pathname: settings.approveUri})), browseToResult)
}

function browseToResult(err, exitCode) {
	if (err) shutdown(err)
}

/*
request: http.ServerRequest (net.IncomingMessage)
response: http.ServerResponse
*/
var secret
function requestListener(request, response) {
	var urlObject = urlm.parse(request.url, true)
	var p = urlObject.pathname
	var q = urlObject.query

	if (p === settings.approveUri && !q.oauth_token && !q.denied) twitterOAuth.getAuthorizationUrl(toTwitter)
	else if (p === settings.oauthUri && q.oauth_token) twitterOAuth.getTwitterApi({
		oauth_token: q.oauth_token,
		oauth_secret: secret,
		oauth_verifier: q.oauth_verifier}, toSuccess)
	else if (p === settings.oauthUri && q.denied) {
		var deniedUrlObject = haraldutil.merge(serverUrlObject, {pathname: settings.deniedUri})
		response.writeHead(302, {'Location': urlm.format(deniedUrlObject)})
		response.end(request.method !== 'HEAD' ? 'Redirecting ...' : false)
	} else if (urlObject.pathname === settings.deniedUri) {
		response.setHeader('Content-type', 'text/plain')
		response.end(request.method !== 'HEAD' ? 'The app was not approved at ' + new Date().toISOString() + '.' : false)
	} else if (urlObject.pathname === settings.successUri) {
		response.setHeader('Content-type', 'text/plain')
		response.end(request.method !== 'HEAD' ? 'The app was approved at ' + new Date().toISOString() + '.' : false)
	} else {
		var statusCode = 404
		response.writeHead(statusCode, {'Content-type': 'text/plain'})
		response.end(request.method !== 'HEAD' ? http.STATUS_CODES[statusCode] : false)
	}

	function toTwitter(err, oauthData) {
		if (!err) {
			secret = oauthData.secret
			response.writeHead(302, {'Location': oauthData.url})
			response.end(request.method !== 'HEAD' ? 'Redirecting to Twitter...' : false)
		} else {
			response.writeHead(500, {'Content-type': 'text/plain'})
			var text = err.stack || err.message || err
			if (typeof text !== 'string') text = haraldutil.inspectDeep(text)
			response.end(text)
		}
	}

	function toSuccess(err, twitterApi) {
		if (!err) {
			response.writeHead(302, {'Location': urlm.format(haraldutil.merge(serverUrlObject, {pathname: settings.successUri}))})
			response.end(request.method !== 'HEAD' ? 'Redirecting ...' : false)
		} else {
			response.writeHead(500, {'Content-type': 'text/plain'})
			var text = err.stack || err.message || err
			if (typeof text !== 'string') text = haraldutil.inspectDeep(text)
			response.end(text)
		}
	}
}

function shutdown(err) {
	if (err) require('haraldutil').p(err.stack || err.message || err)
	if (endServer) endServer.close()
}
