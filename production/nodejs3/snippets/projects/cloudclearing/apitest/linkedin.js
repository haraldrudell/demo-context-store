// linkedin.js
// test the LinkedIn api
var spawn = require('child_process').spawn

// TODO change from request to http

// https://github.com/ciaranj/node-oauth
var OAuth = require('oauth').OAuth

// https://github.com/visionmedia/express
var express = require('express')

// parameters for our web server
var webserver = {
	port: 3009,
	hostname: 'localhost',
	authenticateUri: '/authenticate',
	doneUri: '/done'
}
if (webserver.port != 80) webserver.hostname += ':' + webserver.port

// data provided to the oauth module
var oauthParameters = {
	//
	requestUrl: 'https://api.linkedin.com/uas/oauth/requestToken',
	// 
	accessUrl: 'https://api.linkedin.com/uas/oauth/accessToken',
	// consumerKey is provided when registering with the OAuth provider
	// LinkedIn name: API Key
	consumerKey: 'ywwxofmt8h8w',
	// consumerSecret is provided when registering with the OAuth provider
	// LinkedIn name: Secret Key
	consumerSecret: 'DqJsrmpDZ0p1D1MX',
	// OAuth version
	version: '1.0',
	// OAuth Callback URL
	// authorize_callback: or oob (pin code experience)
	authorize_callback: 'http://' + webserver.hostname + webserver.doneUri,
	// signatureMethod: PLAINTEXT or HMAC-SHA1
	signatureMethod: 'HMAC-SHA1',
	// nonceSize: default 32
	nonceSize: undefined,
	// customHeaders: optional
	customHeaders: {
		"Accept" : "*/*",
		"Connection" : "close",
		"User-Agent" : "Node authentication",
		'x-li-format': 'json'
	}
}

var client = new OAuth(oauthParameters.requestUrl,
		oauthParameters.accessUrl,
		oauthParameters.consumerKey,
		oauthParameters.consumerSecret,
		oauthParameters.version,
		oauthParameters.authorize_callback,
		oauthParameters.signatureMethod,
		oauthParameters.nonceSize,
		oauthParameters.customHeaders)
client.Lin = Lin

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

// initial page: has a clickable LinkedIn button
app.get('/', function(req, res) {
	res.send(html('<button onclick="parent.location=\''+
		webserver.authenticateUri +
		'\'">LinkedIn</button>'))
})

// button clicked request: authenticate
app.get(webserver.authenticateUri, function(req, res) {

	// [ extraParams, ] callback(...)
	client.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		var result

		if (error) {
			console.log('error:', error)
			if (error.data) result = error.data
			else result = html(
				error.statusCode ? 'Status Code:' + error.statusCode :
				error)
			res.send(result)
		} else if (!oauth_token || !oauth_token_secret ||
			!results || !results.xoauth_request_auth_url) {
			result = html('inadequate OAuth request token reponse')
			res.send(result)
		} else {

			//console.log(oauth_token, oauth_token_secret, results)
			client.oauth_token_secret = oauth_token_secret

			// Because LinkedIn runs on OAuth 1.0a, you must not add an oauth_callback parameter
			var url = results.xoauth_request_auth_url +
			'?oauth_token=' + oauth_token

			res.redirect(url, 302)
		}	
	})
})

// authentication complete page
app.get(webserver.doneUri, function(req, res) {

	var oauth_token = req.query['oauth_token']
	var oauth_verifier = req.query['oauth_verifier']
	if (!oauth_token || !oauth_verifier || !client.oauth_token_secret) {
		res.send(html('inadequate authorization reponse'))
	} else {
		var oauth_token_secret = client.oauth_token_secret
		delete client.oauth_token_secret
		// oauth_token, oauth_token_secret, oauth_verifier, callback
		client.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier,
			function (error, oauth_access_token, oauth_access_token_secret, results) {
			var result = ''
			var htmlResult

			if (error) {
				console.log('error:', error)
				if (error.stack) console.log(error.stack)

				if (error.data) htmlResult = error.data
				else result = error.statusCode ?
					'Status Code:' + error.statusCode :
					error.toString()
				res.send(htmlResult || html(result))
			} else {
				client.oauth_access_token = oauth_access_token
				client.oauth_access_token_secret = oauth_access_token_secret

				result = '<div>'

				Lin('http://api.linkedin.com/v1/people/~' +
					':(' + fields() + ')',
					function (error, html) {
					if (error) done()
					result += html
					Lin('http://api.linkedin.com/v1/people/~/connections' +
						':(' + fields() + ')' +
						'?count=1',
						function (error, html) {
						if (!error) result += html
						result += '</div>'
						done()
					})
				})

				function done() {
					res.send(result)
				}
			}
		})
	}
})
app.listen(webserver.port)

browse('http://' + webserver.hostname)
// OAuth
// http://en.wikipedia.org/wiki/Oauth
// http://tools.ietf.org/html/draft-ietf-oauth-v2-25

// Authentication flow
// must run in a browser so that login dialog can be displayed
// must have an accessible url so that the app can continue after login

function Lin(url, callback) {

	// url, method, oauth_token, oauth_token_secret, callback
	client.getProtectedResource(url, 'GET',
		client.oauth_access_token, client.oauth_access_token_secret,
		function (error, data, response) {
			var result = ''
			if (!error) {
				var obj = JSON.parse(data)
				result = '<ol>'
				if (obj.values) {
					obj.values.forEach(function(value) {
						result += convertJson(value)
					})
				} else result = convertJson(obj)
				result += '</ol>'
			} else console.log(error)
			callback(error, result)
	})

	function convertJson(value) {
		var result = ''

		for (var property in value) {
			if (true //property != 'apiStandardProfileRequest' &&
				//property != 'siteStandardProfileRequest'
				) {
				var val = value[property]
				if (typeof val == 'object') {
					val = JSON.stringify(val)
				}
				result += '<li>' + property + ':' + val + '</li>'
			}
		}
		return result
	}

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

function browse(url) {
	var cmd =
		process.platform == 'win32' ? 'explorer.exe' :
		process.platform == 'darwin' ? 'open' :
		'xdg-open'

	//console.log('spawn', cmd, [url])
	spawn(cmd, [url])
}

function fields() {
	// spaces not allowed
	var result = [
		'id',
		'first-name',
		'last-name',
		'maiden-name',
		'formatted-name',
		'phonetic-first-name',
		'phonetic-last-name',
		'formatted-phonetic-name',
		'headline',
		'location:(name,country:(code))',
		'industry',
		'distance',
		'relation-to-viewer:(distance)',
		'last-modified-timestamp',
		'current-share',
		'network',
		//'connections', // list of many profiles
		'num-connections',
		'num-connections-capped',
		'summary',
		'specialties',
		'proposal-comments',
		'associations',
		'honors',
		'interests',
		'positions',
		'publications',
		'patents',
		'languages',
		'skills',
		'certifications',
		'educations',
		'courses',
		'volunteer',
		'three-current-positions',
		'three-past-positions',
		'num-recommenders',
		'recommendations-received',
		'phone-numbers',
		'im-accounts',
		'twitter-accounts',
		'primary-twitter-account',
		'bound-account-types',
		'mfeed-rss-url',
		'following',
		'job-bookmarks',
		'group-memberships',
		'suggestions',
		'date-of-birth',
		'main-address',
		'member-url-resources:(url,name)',
		'picture-url',
		'site-standard-profile-request',
		'api-standard-profile-request:(url,headers)',
		'public-profile-url',
		'related-profile-views',
	].join(',')

	// 710 characters or so is max
	//console.log(result.length, result)

	return result
}