// webstream.js
// Readwrite stream scraping url resources from the web
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

require = require('apprunner').getRequire(require)

var fnreadwritestream = require('fnreadwritestream')
var rqsm = require('rqs')
var instrument = require('instrument')
// https://github.com/mikeal/request
var requestm = require('request')
// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/api/util.html
var util = require('util')

var time10s = 1e4
var time30s = 3e4
var ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.14 Safari/537.4'

exports.WebStream = WebStream

/*
opts: object
.baseTime: optional timeval

input data:
.url: string url

output data:
input data with added body: string

events
'warning' err: for status codes other than 200
*/
function WebStream(opts) {
	var self = this
	var rqs = rqsm.initApi().getRqs(function () {}, arguments.callee.name, time10s)

	opts.e = new events.EventEmitter
	fnreadwritestream.FnReadWriteStream.call(this, opts)
	opts.e.on('input', webFetcher)
	new instrument.Instrument({emitter: this, begin: opts.baseTime, slogan: arguments.callee.name})

	function webFetcher(data, cb) {
		var timer = rqs.addRq(data.url, opts.timeout || time10s)
		requestm.get({url: data.url, headers: {'User-Agent': ua}}, scrapedResource)

		function scrapedResource(err, resp, body) {
			timer.clear()
			if (!err && resp.statusCode === 200) {
				data.body = body
				opts.e.emit('data', data)
			} else {
				if (!err) self.emit('warning', new Error('Status code:' + resp.statusCode + ' at:' + data.url))
			}
			cb(err)
		}
	}
}
util.inherits(WebStream, fnreadwritestream.FnReadWriteStream)
