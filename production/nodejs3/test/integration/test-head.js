// test-head.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

/*
Verify that a head request does not receive a body
*/

// http://nodejs.org/api/http.html
var http = require('http')

var log = console.log

var assert = require('mochawrapper')

exports['TestHead:'] = {
	'haraldrudell.com': function (done) {
		var options = {
			method: 'HEAD',
			host: 'www.haraldrudell.com',
			port: 80,
			path: '/'
		}

		// http.ClientRequest extends http.OutgoingMessage, stream.Stream, events.EventEmitter
		var clientRequest = new http.ClientRequest(options, responseListener)
			.on('error', errorListener)
		// socket finish drain response
		logEvents(clientRequest, 'requestEvent')
		clientRequest.end() // return value: true if all data sent, no callback

		function responseListener(response) {
			if (response.statusCode === 200) {
				response.on('data', dataListener)
					.once('end', endListener)
				response.setEncoding('utf8')
			} else log('status code:', response.statusCode)
		}

		function dataListener(chunk) {
			log('data:', chunk.length)
		}

		function endListener() {
			log('end')
			done()
		}

		function errorListener(e) {
			log('error', e.stack || e.message || e)
		}

		function logEvents(emitter, slogan) {
			var emit = emitter.emit
			emitter.emit = logEvent
			return unwrap

			function logEvent(event) {
				var logArgs = []
				if (slogan) logArgs.push(slogan)
				logArgs.push(event)
				log.apply(this, logArgs)
				emit.apply(emitter, Array.prototype.slice.call(arguments))
			}

			function unwrap() {
				emitter.emit = emit
			}
		}
	},
}
