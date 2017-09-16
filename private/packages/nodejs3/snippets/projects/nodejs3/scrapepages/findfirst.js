// findfirst.js

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')
// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

/*
.title
.id
.sourceName or name
*/
var db
var coll
var time24h = 24 * 3600 * 1e3

var updateValuesToDatabase = false

getColl(find, programEnd)

/*
fs.readFile('gdgdgdg', function (err, data) {
	errorReport(err, new Error)
})
*/

function errorMessage(e) {

	// basic message
	var result = [String(e)]

	if (e instanceof Error) {

		// location and stack trace
		if (typeof e.stack == 'string') {
			var stack = e.stack.split('\n')
			if (stack.length > 1) {
				result.push('  Location:' + stack[1].trim())
				for (var ix = 2; ix < stack.length; ix++) {
					result.push(stack[ix])
				}
			}
		}

		// custom properties
		var props = [' ']
		for (var p in e) {
			props.push(' ')
			props.push(p)
			props.push(':')
			props.push(String(e[p]))
		}
		if (props.length > 1) result.push(props.join(''))
	}

	return result.join('\n')
}

function find () {
	var resultPrinter = getResultPrinter(programEnd)
	var f = resultPrinter
	var writeUpdates
	if (updateValuesToDatabase) {
		writeUpdates = getWriteUpdates(resultPrinter, errorReport, complete)
		f = writeUpdates
	}
	var minFinder = getMinFinder(f, errorReport, complete)
	var scanForRetired = getScanForRetired(minFinder, errorReport, complete)
	var activePositionsProducer = getActivePositionsProducer(scanForRetired, errorReport, complete)
	activePositionsProducer()

	// obtain the document for each active position
	// nextData(data): gets data until data is non-true
	// errorReport(err, loc) gets any number of Error, Error indicating location
	// complete() gets the invoked when all activity is complete
	function getActivePositionsProducer(nextData, errorReport, complete) {
		var func = arguments.callee.name
		return function activePositionsProducer() {
			// find active positions
			coll.find({lastSeen: {$exists:true}}).each(function (err, doc0) {
				// will get callback until err or doc0 is non-true
				if (!err) {
					if (doc0) {
						var data = {
							title: doc0.title,
							id: doc0.id,
							sourceName: doc0.sourceName,
							firstSeen: new Date(doc0.firstSeen),
							others: [],
							doc0: doc0,
						}
						nextData(data)
					} else end()
				} else {
					errorReport(err, new Error)
					end()
				}
			})
		}
		function end() {
			complete(func)
			nextData()
		}
	}

	function getScanForRetired(nextData, errorReport, complete) {
		var func = arguments.callee.name
		var cbCount = 1
		return function scanForRetired(data) {
			if (data) {
				cbCount++
				coll.find(
					{title: data.doc0.title, id: data.doc0.id, lastSeen: {$exists:false}},
					{sort:{firstSeen:1}}).each(function (err, doc) {
					if (!err) {
						if (doc) {
							data.others.push({
								sourceName: doc.sourceName || doc.name,
								timeValue: doc.firstSeen,
								firstSeen: new Date(doc.firstSeen),
							})
						} else {
							nextData(data)
							end()
						}
					} else {
						errorReport(err, new Error)
						end()
					}
				})
			} else end()
		}

		function end() {
			if (--cbCount == 0) {
				complete(func)
				nextData()
			}
		}
	}

	function getMinFinder(nextData, errorReport, complete) {
		var func = arguments.callee.name
		var cbCount = 1
		return function minFinder(result) {
			if (result) {
				cbCount++
				result.minval = result.doc0.firstSeen
				result.others.forEach(function (alt) {
					if (alt.timeValue < result.minval) result.minval = alt.timeValue
				})
				nextData(result)
			}
			if (--cbCount == 0) end()
		}

		function end() {
			complete(func)
			nextData()
		}
	}

	function getResultPrinter(end) {
		var needsUpdate = 0
		var total = 0
		return function resultPrinter(data) {
			if (data) {
				total++
				if (data.minval < data.doc0.firstSeen) needsUpdate++
			} else {
				console.log(arguments.callee.name, 'needs update:', needsUpdate, total)
				end()
			}
		}
	}

	function complete(text) {
		console.log(text, 'completed.')
	}

	function getWriteUpdates(nextData, errorReport, complete) {
		var func = arguments.callee.name
		var cbCount = 1
		return function writeUpdates(data) {
			if (data) {
				if (data.minval < data.doc0.firstSeen) {
					cbCount++
					coll.update(
						{_id: data.doc0._id}, // selector
						{$set:{firstSeen: data.minval}}, // update object
						{safe:true}, // options
						function (err, result) { // callback
							if (!err) {
								console.log('updated:', data.title)
							} else {
								errorReport(err, new Error)
							}
							nextData(data)
							end()
					})
				} else nextData(data)
			} else end()
		}
		function end() {
			if (--cbCount == 0) {
				complete(func)
				nextData()
			}
		}
	}
}

function programEnd() {
	//errorReport(new Error(arguments.callee.name), new Error)
	close(function (err) {
		if (!err) console.log('The program ended.')
		else console.log('Error on close', err)
	})
}

function errorReport(err, loc) {
	console.log(arguments.callee.name, errorMessage(err))
	if (loc instanceof Error && loc.stack) console.log('discovered:', loc.stack.split('\n')[1].trim())
}

// close db or throw
function close(cb) {
	if (db) {
		var dbx = db
		db = null
		dbx.close(cb)
	} else cb()
}

// get collection or throw
function getColl(cb, cbe) {
	var defaults = JSON.parse(fs.readFileSync(
		path.join(process.env[
			process.platform == 'win32' ?
			'USERPROFILE' :
			'HOME'], 'apps', 'nodejs3.json'), 'utf-8'))
	mongodb.connect(defaults.jobstore.dbUrl, defaults.jobstore.dbOpts, function (err, dbx) {
		if (!err && dbx) {
			db = dbx
			coll = db.collection(defaults.jobstore.collection)
			cb()
		} else {
			if (!err) err = Error('No db from mongo')
			cbe(err)
		}
	})
}