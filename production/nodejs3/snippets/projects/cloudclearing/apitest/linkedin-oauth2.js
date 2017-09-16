// linkedin.js
// test the LinkedIn api

// https://github.com/ciaranj/node-oauth
var OAuth = require('oauth').OAuth2

// https://github.com/visionmedia/express
var express = require('express')
var port = 3009
var url = 'localhost:' + port
var authenticateUri = '/authenticate'
var doneUri = '/done'
var LinkedInUrl = 'https://api.linkedin.com/uas/oauth/authorize'

// Setup a web server for OAuth2 requests
var app = express.createServer()
app.configure(function() {
	app.use( // log requests to console
		function logAll(req, res, next) {
		console.log(logString(req))
		next()
	})
	app.use(express.bodyParser())
	app.use(app.router)
})
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
app.get('/', function(req, res) {
	res.send(html('<button onclick="parent.location=\''+
		authenticateUri +
		'\'">LinkedIn</button>'))
})
app.get(authenticateUri, function(req, res) {
	authenticate(req, res, function(result, htmlResult) {
		res.send(htmlResult ? htmlResult :
			html('Done:' + result))
	})
})
app.get(doneUri, function(req, res) {
	res.send(html('Done'))
})
app.listen(port)

// OAuth
// http://en.wikipedia.org/wiki/Oauth
// http://tools.ietf.org/html/draft-ietf-oauth-v2-25

// Authentication flow
// must run in a browser so that login dialog can be displayed
// must have an accessible url so that the app can continue after login

function authenticate(req, res, after) {
	var result = ''
	var htmlResult
	var client = new OAuth(
		// clientId is a key provided when registering with the OAuth2 provider
		// LinkedIn name: API Key
		'ywwxofmt8h8w',
		//clientSecret is a secret provided when registering with the OAuth2 provider
		// LinkedIn name: Secret Key
		'DqJsrmpDZ0p1D1MX',
		// baseSite
		// url where OAuth2 authenticating server is located
		LinkedInUrl,
		// authorizePath
		'/y',
		//accessTokenPath
		doneUri
		)

	client.getOAuthAccessToken('', undefined, function (error, access_token, refresh_token) {
		console.log('callback:')		
		if (error) {
			console.log('error:', error)
			if (error.stack) console.log(error.stack)
			if (error.data) htmlResult = error.data
			if (error.statusCode) result += 'Status Code:' + error.statusCode
			else {
				result += error.toString()
			}
		}
		if (access_token) result += 'Access Token:' + access_token
		if (refresh_token) result += 'Access Token:' + access_token
		after(result, htmlResult)
	})
}

// log requests
// request: request object
// return value: printable string describing the request
function logString(request) {
	var info = request.method
	if (request.headers) {
		info += ' ' + (request.headers['x-forwarded-proto'] || 'http') + '://'
		info += (request.headers.host || 'host?')
		if (request.headers['x-forwarded-port'] &&
			request.headers['x-forwarded-port'] != 80) {
			info += ':' + request.headers['x-forwarded-port']
		}
		info += request.url
		info += ' from ' + (request.headers['x-forwarded-for'] || '?')
		info += ' ua:' + (request.headers['user-agent'] || '-')
	}
	return info	
}

// wrap tags for body to become html5 document
function html(body, title) {
	if (!title) title = 'Title'
	return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' +
		title +
		'</title></head><body>\n' +
		body +  
		'\n</body></html>'
}
