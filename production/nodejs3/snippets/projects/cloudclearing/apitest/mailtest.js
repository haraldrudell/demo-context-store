// mailtest.js
// Set up a responder that allows for email send test

// imports
var haraldops = require('haraldops')
var express = require('express')
// http://nodejs.org/docs/latest/api/url.html
var url = require('url')
// http://nodejs.org/docs/latest/api/child_process.html
var spawn = require('child_process').spawn

// get our configuration
var defaults = haraldops.defaults(__filename + 'on')
var ops = haraldops.opsconstructor(console.log, defaults)

// launch our server so we can display things to the user
// and receive redirects from LinkedIn after authoriztion
console.log('starting server:', defaults.hostUrl)
var port = getPort(defaults.hostUrl)
var app = express.createServer()
if (defaults.responder) {
	ops.responder(app, defaults.responder)
}
app.listen(port)
browseTo(defaults.hostUrl + defaults.responder)

// display the web destination url to the user
function browseTo(url) {
	var cmd =
		process.platform == 'win32' ? 'explorer.exe' :
		process.platform == 'darwin' ? 'open' :
		'xdg-open'

	//console.log('spawn', cmd, [url])
	spawn(cmd, [url])
}

function getPort(hostUrl) {
	var port

	// check for specific port number
	if (hostUrl != null && typeof hostUrl == 'string') {
		var urlObject = url.parse(hostUrl, false, true)

		// port number given
		if (urlObject.port) {
			var num = parseInt(urlObject.port)
			if (!isNaN(num)) port = num
		}

		// https default port
		if (!port && urlObject.protocol &&
			urlObject.protocol == 'https:') {
			port = 443
		}
	}

	// default port
	if (!port) port = 80

	return port
}
