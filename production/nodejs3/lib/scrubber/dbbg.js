// dbbg.js
// Retire data no longer present
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// https://github.com/mikeal/request
var requestm = require('request')
// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/api/util.html
var util = require('util')

exports.DbBg = DbBg

/*
Retire database records
opts: object
.coll object: mongo database collection
.timeval: records with lastSeen less than timeval are retired
.ping: string: url used for get ping if success
.log optional function: log function
.control: boolean default true: false: read only

if LastSeen exists and is less than opts.timeval, retire the position
retire: move lastSeen to lastSaw, clear LastSeen

events
'start', 'stop' for instrumentation
'error' err
final event: 'end' or one or more 'error'

used by lib/scrubber/scrapemanager.js
*/
function DbBg(opts) {
	var self = this
	events.EventEmitter.call(this)
	var log = apprunner.getAppData().getLog(opts.log, arguments.callee.name)
	var readOnlyMode = opts.readonly
	var serial = 0
	var itemCounter = 1
	var isError

	if (readOnlyMode) log('read-only mode')
	process.nextTick(doFind)

	function doFind() {
		opts.coll.find({lastSeen: {$exists:true, $lt: opts.timeval}}, retireEach)
	}

	function retireEach(err, cursor) {
		if (!err) cursor.each(retireOne)
		else emitFinal(err) // err was already reported by mongo api
	}

	/*
	Retire record doc
	err: possible instanceof Error
	doc: a data record to retire or null on end of data
	*/
	function retireOne(err, doc) {
		var id

		if (!err && !isError) {
			if (doc) {
				self.emit('start', id = serial++)
				itemCounter++
				if (!readOnlyMode) {
log('retired:', [doc.sourceName, doc.title, doc.id].join('-'),
	'seenAgo:', haraldutil.periodString(opts.timeval - doc.lastSeen),
	'firstSeen:', new Date(doc.firstSeen).toISOString())
					doc.lastSaw = doc.lastSeen
					delete doc.lastSeen
					opts.coll.findAndModify(
						{_id:doc._id}, // query
						[], // sort
						doc, // update object
						retireOneDone)
				} else retireOneDone() // read-only does not update database
			} else itemSuccess() // itemSuccess of items
		} else if (err) emitFinal(err) // find had an error

		function retireOneDone(err) {
			self.emit('stop', id)
			if (!err) itemSuccess()
			else emitFinal(err)
		}
	}

	// invoked after last item submitted
	function itemSuccess() {
		var rqs
		var timer

		if (!isError && !--itemCounter) {
			if (opts.ping) {
				rqs = apprunner.getRqs(function () {}, log.marker)
				timer = rqs.addRq('ping')
				requestm.get(opts.ping, pingResult)
			} else emitFinal()
		}

		function pingResult(err, resp, body) {
			timer.clear()
			rqs.shutdown()
			if (!err && resp.statusCode === 200) {
				if (body !== 'OK') err = new Error('Bad response from expect: ' + body)
			} else if (!err) err = new Error('statusCode: ' + resp.statusCode)

			if (!err) emitFinal()
			else emitFinal(err, {url: opts.ping})
		}
	}

	function emitFinal(err) {
		if (!err) {
			if (!isError) self.emit('end')
		} else {
			isError = true
			var args = Array.prototype.slice.call(arguments)
			apprunner.anomaly.apply(self, args)
			self.emit.apply(self, ['error'].concat(args))
		}
	}
}
util.inherits(DbBg, events.EventEmitter)
