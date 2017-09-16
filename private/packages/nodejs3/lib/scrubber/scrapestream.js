// scrapestream.js
// Read write stream that scrapes data from a body string
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

var require = require('apprunner').getRequire(require)

var pagescraper = require('../pagescraper/pagescraper')
var fnreadwritestream = require('fnreadwritestream')
var instrument = require('instrument')
// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/api/util.html
var util = require('util')

exports.ScrapeStream = ScrapeStream

/*
opts: object
.baseTime: optional timeval
.filter: optional function: title filter

input data:
.body: string
.url: string
.pageType: object
.sourceName: string

output data:
.result: title, id, url, sourceName
.url: string: the page that was scraped
*/
function ScrapeStream(opts) {
	var self = this
	opts.e = new events.EventEmitter
	fnreadwritestream.FnReadWriteStream.call(this, opts)
	opts.e.on('input', scrapeBody)
	new instrument.Instrument({emitter: this, begin: opts.baseTime, slogan: arguments.callee.name})

	function scrapeBody(data, cb) {
		data.emitter = opts.e
		data.wemitter = self
		data.filter = opts.filter
		pagescraper.processPage(data, cb)
	}
}
util.inherits(ScrapeStream, fnreadwritestream.FnReadWriteStream)
