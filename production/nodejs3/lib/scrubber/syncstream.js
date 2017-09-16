// syncstream.js
// Write stream that syncs items to database
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

require = require('apprunner').getRequire(require)

var syncrecord = require('./syncrecord')
var fnwritestream = require('fnwritestream')
var instrument = require('instrument')
var rqsm = require('rqs')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// http://nodejs.org/api/util.html
var util = require('util')

var slogan = 'SyncDb'

exports.SyncStream = SyncStream

/*
Instrumented write stream that syncs to database
opts: object
.timeval: number baseTime
.folder: string folder to save downloaded files
.coll: object mongo db collection
.readonly: optional boolean default false
*/
function SyncStream(opts) {
	opts.fn = syncrecord.syncRecord
	opts.rqs = rqsm.initApi().getRqs(function () {}, slogan)
	opts.anomaly = apprunner.anomaly
//	opts.readonly = true

	if (opts.readonly) console.log(arguments.callee.name, 'read-only')
	fnwritestream.FnWriteStream.call(this, opts)
	new instrument.Instrument({emitter: this, begin: opts.timeval, slogan: slogan})
}
util.inherits(SyncStream, fnwritestream.FnWriteStream)
