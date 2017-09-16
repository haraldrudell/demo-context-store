// scrapemanager.js
// supervises periodic and on-demand scrapes
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

var require = require('apprunner').getRequire(require)

var scrapecycle = require('./scrapecycle')
var scrapemailer = require('./scrapemailer')
var instrument = require('instrument')
var mongo = require('mongo')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// https://github.com/haraldrudell/haraldops
var haraldops = require('haraldops')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

;[
init, scrapeCycle, getCollection, getParameters,
].forEach(function (f) {exports[f.name] = f})

var pageTypesFile = 'pagetypes'
var log = console.log

var coll
var downloadFolder
var scrapeSettings = {}
/*
key: printable string: location name
value: object
.disabled: optional boolean, default false: ignore this location
url: string: url for GET
type: string: method of scraping in pageTypeObject
*/
var locationsObject = {}
/*
key: page type
value: object or 'rss2.0'
.url: object
.id object
.json: optional string: json property
*/
var pageTypeObject = {}

var titleRegExpMap = { // key: printable name, value: RegExp or 1 for default value
	Engineer: /\b[Ee]ngineer/,
	Manager: /\b[Mm]anager/,
	Sales: /\b[Ss]ales/,
	Architect: /\b[Aa]rchitect/,
	Developer: /\b[Dd]eveloper/,
	Default: 1,
}

/*
defaults: object
.scrapesettings: object
.doSync: boolean, default true
.doDbbg: boolean, default true
.runScheduled
runOnLoad
*/
function init(defaults) {
	var appData = apprunner.getAppData()
	var cbCounter = 1
	var err

	log = appData.getLog(defaults.log, path.basename(__filename, path.extname(__filename)))
	if (defaults && typeof defaults.scrapesettings === 'object') {
		scrapeSettings = defaults.scrapesettings
		if (scrapeSettings.doSync === false) log('doSync false: scrape datastore disabled')
		if (scrapeSettings.doDbbg === false) log('doDbbg false: scrape retiring disabled')

		cbCounter++
		downloadFolder = path.join(haraldutil.getTmpFolder(), appData.appId)
		fs.exists(downloadFolder, createFolder)

		if (defaults.jobstore) {
			cbCounter++
			prepareDatabase(defaults.jobstore.db)
		}

		try { // get page types
			var data = haraldops.loadSettings(pageTypesFile, undefined, undefined, function () {})
			var pt = data && data.pagetypes
			if (pt) {
				pt = patchRegExp(pt)
				for (var pagetype in pt) delete pt[pagetype].comments
				pageTypeObject = pt
			} else throw new Error('No page types in: ' + file)
		} catch (e) {
			if (!err) err = e
			apprunner.anomaly(e, {file: pageTypesFile})
		}

		if (!err) {
			try {
				var data = haraldops.loadSettings(log.marker, undefined, undefined, function () {})
				var loc = data && data.locations
				if (loc) {
					for (var locationName in loc) {
						var location = loc[locationName]
						if (location.disabled) {
							log('location disabled:', locationName)
							delete loc[locationName]
						} else {
							var type = location.type
							if (!type || !pageTypeObject[type]) {
								throw new Error('Unknown location for source \'' + locationName + '\': \'' + type + '\'')
							}
						}
					}
					locationsObject = loc
				} else throw new Error('No locations in: ' + file)
			} catch (e) {
				if (!err) err = e
				apprunner.anomaly(e, {file: log.marker})
			}
		}
		end(err)
	}

	function createFolder(exists) {
		if (!exists) fs.mkdir(downloadFolder, reportError)
		else end()
	}

	function prepareDatabase(db) {
		var c = new mongo.Mongo({db: db})
			.once('ready', doIndex)

		function doIndex(err) {
			if (!err) {
				c.ensureIndex({title:1, sourceName: 1, firstSeen:1, id:1},
					{unique: true},
					indexResult)
			} else end(err)
		}

		function indexResult(err) {
			if (!err) {
				coll = c
				end()
			} else end(err)
		}
	}

	function reportError(e) {
		if (e) {
			if (!err) err = e
			apprunner.anomaly(Array.prototype.slice.call(arguments))
		}
		end(e)
	}

	function end(err) {
		if (!err) {
			if (!--cbCounter) {
				log('locations:', Object.keys(locationsObject).length)
				if (scrapeSettings.runScheduled) scrapemailer.init(scrapeCycle, appData.sendMail)
				if (scrapeSettings.runOnLoad) scrapeCycle()
			}
		} else log('Error:', err.stack || err.message || err)
	}
}

// recursevly scan for strings in o, if the begin with 'regexp:' convert to RegExp
function patchRegExp(value) {
	var objects = []
	var topObject = {v: value}
	patchProperties(topObject)
	return topObject.v

	function patchProperties(o) {
		if (!~objects.indexOf(o)) {
			objects.push(o)
			var v
			for (var p in o) {
				if (v = o[p]) {
					if (typeof v.valueOf() == 'string' &&
						v.substring(0, 7) == 'regexp:')
						o[p] = new RegExp(v.substring(7, v.length).replace('/', '\\/'))
					else
						patchProperties(v)
				}
			}
		}
	}
}

function scrapeCycle(opts, cb) {
	var o = haraldutil.shallowClone(opts)
	o.scrapeSettings = scrapeSettings
	o.coll = coll
	o.locationsObject = locationsObject
	o.pageTypeObject = pageTypeObject
	o.titleRegExpMap = titleRegExpMap
	o.folder = downloadFolder
	o.webstreamtime = scrapeSettings.webstreamtime
	var sc = new scrapecycle.ScrapeCycle(o, cb)
	apprunner.addErrorListener(sc)
}

// jobsdate gets the collection here
function getCollection() {
	return coll
}
function getParameters() {
	return {
		sources: Object.keys(locationsObject),
		titles: Object.keys(titleRegExpMap),
	}
}
