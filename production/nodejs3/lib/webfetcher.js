// webfetcher.js
// readwrite stream scraping using phantomjs
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

/*
Read-write stream providing out-of-process Web scraping
*/

require = require('apprunner').getRequire(require)

var fnreadwritestream = require('fnreadwritestream')
var phantomlink = require('phantomlink')
// http://nodejs.org/api/util.html
var util = require('util')

exports.WebFetcher = WebFetcher

/*
opts: object

'warning' Error: one item failed
'error' Error: the instance failed
'data' one processed
*/
function WebFetcher(opts) {
	var self = this
	var emitter = opts.e = new events.EventEmitter()
		.on('input', processItem)
	fnreadwritestream.FnReadWriteStream.call(this, opts)
	var browser = phantomlink.Phantom()
		.on('error', emitError)
		.once('ready', browserReady)

	/*
	process data item that was written to the stream
	data: value written to the stream
	cb(err): callback for write complete
	*/
	function processItem(data, cb) {
		// TODO
		cb()
	}

	function browserReady() {

	}

	function emitError(e) {
		self.emit('error', e)
	}
}
util.inherits(WebStream, fnreadwritestream.FnReadWriteStream)
