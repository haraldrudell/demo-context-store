// scrapecycle.js
// do a Web scrape
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// register api, get api-loading require, get error emitter, export initApi and apiState, provide endApi
var require = require('apprunner').getRequire(require)

var sourcestream = require('./sourcestream')
var webstream = require('./webstream')
var scrapestream = require('./scrapestream')
var syncstream = require('./syncstream')
var dbbg = require('./dbbg')
var instrument = require('instrument')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/api/util.html
var util = require('util')

exports.ScrapeCycle = ScrapeCycle

/*
Scrape all web destination and record result in database
opts: optional object
.log: optional log, default apprunner's log
.scrapeSettings
.doSync
.titleRegExpMap
.locationsObject
.pageTypeObject
.source: optional string: name if scraping single source
.title: optional string: titleRegExpMap key if not default title
cb(err, data): optional function

events
'end'
'error'

process:
step 1: either webfetcher-pagescraper or feedscraper
step 2: syndb with dbbg internal and finalStep
*/
function ScrapeCycle(opts, cb) {
	var self = this
	events.EventEmitter.call(this)
	var log = opts.log || apprunner.getAppData().getLog(null, arguments.callee.name)
	var isError
	var baseTime = Date.now()
	var skipSync = opts.scrapeSettings.doSync === false
	var skipDbbg = opts.scrapeSettings.doDbbg === false
	var titleRegExp
	var resultWrap

	log('baseTime:', baseTime, new Date(baseTime).toISOString())
	new instrument.Instrument({emitter: this, begin: baseTime, slogan: log.marker})
	process.nextTick(scrape)

	function scrape() {
		if (!opts) opts = {}
		opts.doSync = typeof opts.sync == 'undefined' || !!opts.sync // on missing or true
		titleRegExp = getRegExp()
		var sources = getSources()

		if (!isError) {
			var sourceStream = new sourcestream.SourceStream({sources: sources, baseTime: baseTime, types: opts.pageTypeObject})
				.on('error', errors)
			var webStream = new webstream.WebStream({baseTime: baseTime, timeout: opts.webstreamtime})
				.on('error', errors)
				.on('warning', warnings)
			var scrapeStream = new scrapestream.ScrapeStream({baseTime: baseTime, filter: filterFunc})
				.on('error', errors)
				.on('warning', warnings)

			if (!skipSync) {
				var syncStream = new syncstream.SyncStream({timeval: baseTime, folder: opts.folder, coll: opts.coll, readonly: opts.scrapeSettings.doSync === 1})
					.on('error', errors)
					.once('close', done)
				scrapeStream.pipe(syncStream)
			} else scrapeStream.once('end', done)

			if (opts.withList) {
				resultWrap = {
					result: [],
					errors: [],
					sourceMap: sources,
				}
				scrapeStream.on('data', saveResult)
			}

			// pipe
			webStream.pipe(scrapeStream)
			sourceStream.pipe(webStream)
		} else if (cb) cb(err)
	}

	function warnings(err) {
		log('Warning:', require('haraldutil').pps(err), this.constructor.name)
		skipDbbg = true
		if (opts.withList) resultWrap.errors.push(err)
	}

	function errors(err) {
		log('Error:', err.stack, this.constructor.name)
		skipDbbg = true
		if (opts.withList) resultWrap.errors.push(err)
	}

	function saveResult(data) {
		resultWrap.result.push(data)
	}

	function done() {
		self.emit('end')
		if (cb) cb(null, resultWrap)
		if (!skipDbbg) {
			var dbBg = new dbbg.DbBg({coll: opts.coll, timeval: baseTime, ping: opts.scrapeSettings.ping, readonly: opts.scrapeSettings.doDbbg === 1})
				.on('error', function (e) {console.log('dbbgerror', e.stack)})
			new instrument.Instrument({emitter: dbBg, begin: baseTime, slogan: 'DbBg'})
		} else log('skip dbbg')
	}

	// show item if text matches, if array of patterns, show if any matches
	// blacklisted words, too
	function filterFunc(text) {

		if (titleRegExp) {
			return titleRegExp.test(text)
		}

		var doShow = Array.isArray(opts.scrapeSettings.linktext) ?
			opts.scrapeSettings.linktext.some(function (regExp) {
				return regExp.test(text)
			}) :
			opts.scrapeSettings.linktext.test(text)
		if (doShow && opts.scrapeSettings.blacklist) {
			// this job title macthed so far, now check against blacklist
			doShow = Array.isArray(opts.scrapeSettings.blacklist) ?
				// must not match any of the blacklist entries
				opts.scrapeSettings.blacklist.every(function (regExp) {
				return !regExp.test(text)
			}) :
			!opts.scrapeSettings.blacklist.test(text)
		}
		return doShow
	}

	function getRegExp() { // opts.title can be a key in title RegExp map
		var result

		if (opts.title) {
			var regExp = opts.titleRegExpMap[opts.title]
			if (regExp instanceof RegExp) result = regExp
			else if (!regExp) emitError(new Error('Unknown title:' + opts.title))
		}

		return result
	}

	function getSources() { // opt.source can be a specific source top search
		var result

		if (opts.source) {
			var source = opts.locationsObject[opts.source]
			if (source) {
				result = useSource = {}
				result[opts.source] = true
			} else emitError(new Error('Unknown source:' + opts.source))
		} else result = opts.locationsObject

		return result
	}

	function emitError(err) {
		self.emit('error', err)
		isError = true
	}
}
util.inherits(ScrapeCycle, events.EventEmitter)
