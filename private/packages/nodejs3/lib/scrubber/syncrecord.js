// syncrecord.js
// Update the database with the world's new state
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

require = require('apprunner').getRequire(require)

var uuid = require('uuid')
var fsjournal = require('./fsjournal')
// https://github.com/mikeal/request
var requestm = require('request')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

var time10s = 1e4
var fsTimeout = time10s

exports.syncRecord = syncRecord

/*
Sync one record
data: object
.result: doc
opts: object
.timeval: number baseTime
.folder: string folder to save downloaded files
.coll: object mongo db collection
.rqs: object: rq factory
.anomaly: function to report if more than one error
emitter: object: emitter for 'start' 'stop' events
cb(err): function

*/
function syncRecord(data, opts, emitter, cb) {
	var rq
	var cbCounter
	var isError
	var doc = data.result
	var serial
	var marker = arguments.callee.name
	var readOnly = opts.readonly

	if (recordOk(data)) {
		serial = startNext('findOne')
		rq = opts.rqs.addRq({name: 'findOne', title: doc.title, id: doc.id})
		opts.coll.findOne({
			title: doc.title,
			id: doc.id,
			sourceName: doc.sourceName, // added 121231
			lastSeen: {$exists:true}}, createOrUpdateRecord)
	} else cb(new Error('Bad record'))

	function createOrUpdateRecord(err, existing) {
		rq.clear()
		stop(serial)
		if (!err) {
			if (existing) {
				doc.firstSeen = existing.firstSeen
				existing.lastSeen = opts.timeval
				rq = opts.rqs.addRq({name:'findAndModify'})
				serial = startNext('update')
				if (!readOnly) opts.coll.findAndModify({_id:existing._id}, [], existing, updateResult)
				else updateResult()
			} else { // safe sequence: dowload doc, write to filesystem, then  add record
				doc.firstSeen = opts.timeval
				doc.lastSeen = opts.timeval
console.log('new:', doc.sourceName, doc.title, doc.id)

				serial = startNext('download')
				rq = opts.rqs.addRq({name:'download'}, time10s)
				requestm.get(doc.url, docResult) // fetch Web page
			}
		} else cb(err)
	}

	function docResult(err, resp, body) {
		rq.clear()
		stop(serial)
		if (!err && resp.statusCode === 200) {
			doc._id = uuid.uuid()
			var filename = doc._id + '.html'
			rq = opts.rqs.addRq({name: 'writing:' + filename}, fsTimeout)
			serial = startNext('fs')
			fsjournal.writeEntry({baseFolder: opts.folder, filename: filename, data: body, readOnly: readOnly}, writeEntryResult)
		} else {
			if (!err) err = Error('Response code:' + resp.statusCode)
			err[marker] = {
				sourceName: doc.sourceName,
				title: doc.title,
				id: doc.id,
			}
			end(err)
		}
	}

	function writeEntryResult(err) {
		rq.clear()
		stop(serial)
		if (!err) {
			rq = opts.rqs.addRq({name:'insert'})
			serial = startNext('insert')
			if (!readOnly) opts.coll.insert(doc, {safe:true}, insertResult) // create record in database
			else insertResult()
		} else end(err)
	}

	function insertResult(err) {
		rq.clear()
		stop(serial)
		end(err)
	}

	function end(err) {
		if (!err) {
			if (!--cbCounter) cb()
		} else {
			opts.anomaly(err)
			if (!isError) {
				isError = true
				cb(err)
			}
		}
	}

	function updateResult(err) {
		rq.clear()
		stop(serial)
		cb(err)
	}

	function recordOk(data) { // ensure data has properties making it meaningful
		return data && data.result &&
			typeof data.result.title === 'string' && data.result.title &&
			typeof data.result.url  === 'string' && data.result.url &&
			typeof data.result.sourceName === 'string' && data.result.sourceName
	}

	function startNext(type) {
		if (opts.serial == null) opts.serial = 0
		var result = marker + opts.serial++
		emitter.emit('start', result, type)
		return result
	}
	function stop(serial) {
		emitter.emit('stop', serial)
	}
}
