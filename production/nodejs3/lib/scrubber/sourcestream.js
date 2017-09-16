// sourcestream.js
// Read stream providing scrape source locations
// © 2013 Harald Rudell <harald@therudells.com> All rights reserved.

require = require('apprunner').getRequire(require)

var fnreadstream = require('fnreadstream')
var instrument = require('instrument')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/api/util.html
var util = require('util')

exports.SourceStream = SourceStream

/*
Instrumented read stream that emits source data
opts: object
.sources: map of sources
.baseTime: optiona timeval
.types: map of types

opts.e
'data' data: new data for read stream
'error' err: error to abort read stream
'end': end of file for readstream

emitted data items: object
.url: string
.sourceName: string
.pageType: object

what keeps a SourceStream instance in memory?
(internal functions stored by other objects)
nothing
*/
function SourceStream(opts) {
	var self = this
	var sourceMap = opts.sources
	var typeMap = opts.types
	var dataList = Object.keys(sourceMap)
	var paused
	var isEnd

	opts.e = new events.EventEmitter
	fnreadstream.FnReadStream.call(this, opts)
	self.on('error', end)
	self.on('pause', pause)
	self.on('resume', resume)
	new instrument.Instrument({emitter: this, begin: opts.baseTime, slogan: arguments.callee.name})
	process.nextTick(send)

	function pause() {
		paused = true
	}

	function resume() {
		if (!isEnd) {
			paused = false
			send()
		}
	}

	function send() {
		if (!paused) {
			var sourceName = dataList.shift()
			if (sourceName) {
				self.emit('start', sourceName)
				var data = {sourceName: sourceName}
				var source = sourceMap[sourceName]
				if (typeof (data.url = source.url) !== 'string' || !data.url) opts.e.emit('error', new Error('Bad url for: ' + sourceName))
				else {
					if (!(data.pageType = typeMap[source.type])) opts.e.emit('error', new Error('Unknown type for: ' + sourceName))
					else {
						self.emit('stop', sourceName)
						opts.e.emit('data', data)
						if (!paused) process.nextTick(send)
					}
				}
			} else {
				end()
				opts.e.emit('end')
			}
		}
	}

	function end() {
		isEnd = true
		paused = true
		self.removeListener('error', end)
		self.removeListener('paused', pause)
		self.removeListener('resume', resume)
	}
}
util.inherits(SourceStream, fnreadstream.FnReadStream)
