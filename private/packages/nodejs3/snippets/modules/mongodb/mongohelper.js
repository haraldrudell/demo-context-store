// mongohelper.js
// open and close database, execute function array

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/docs/latest/api/util.html
var util = require('util')

module.exports = {
	get: get,
}

var standard = {
	dbUrl:
		'mongodb://harald:aabbcc@ds031607.mongolab.com:31607/harald',
		//'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing',
	dbOpts: {
		ssl: true,
		//numberOfRetries: 1,
		//reaperTimeout: 1000,
	},
	collection: 'test',
}

// get an object providing boiler-plate code interacting with the database
// defaults: object
// .dbUrl optional string 'mongodb://harald:aabbcc@ds031607.mongolab.com:31607/harald'
// .dbOpts optional object, can have property ssl: true
// .func array of functions invocked in this order
//
// return value: object
// .start() opens the database, executes funcs array, closes the database
// .getValue(o) get a string description of a value
// .errCb(err, cb) if err provide elaborate printout of err and where it was discovered, invoke cb
function get(defaultsArg) {
	var self = {
		start: start,
		getValue: getValue,
		errCb: errCb,
		getState: getState,
		setState: setState,
	}
	var defaults = {}
	var db
	var log = console.log
	var funcs

	// fatal argument problems
	if (defaultsArg == null || typeof defaultsArg != 'object') throw Error('bad defaults argument')
	if (!Array.isArray(defaultsArg.funcs)) throw Error('defaults.funcs bad')

	// clone defaultsArg into defaults
	for (var p in defaultsArg) defaults[p] = defaultsArg[p]
	if (typeof defaults.dbUrl != 'string') defaults.dbUrl = standard.dbUrl
	if (typeof defaults.dbOpts != 'object') defaults.dbOpts = standard.dbOpts
	if (typeof defaults.collection != 'string') defaults.collection = standard.collection
	funcs = defaults.funcs
	if (defaults.log) log = defaults.log

	return self

	function start() {
		defaults.now = new Date
		log(arguments.callee.name + ' at ' + haraldutil.getDateString(haraldutil.getTimestamp(defaults.now)))
		open(next)
	}

	// execute functions in funcs until done
	function next(err) {
		var ff = arguments.callee.name
		if (!err) {
			var func = funcs.shift()
			if (func)  {
				// execute function func
				log(util.format('%s: invoking %s',
					ff,
					func.name))
				func(function (err, value) {
					if (!err) {
						if (value) log(util.format('%s result: %s',
							func.name,
							JSON.stringify(value)))
						next()
					} else {
						log(util.format('%s: function %s returned error.',
							ff,
							func.name))
						throw err
					}
				})
			} else {
				// close then end
				if (db) close(end)
				else end()
			}
		} else throw err

		function end() {
			var now = new Date
			log(util.format('%s: end of program after %s s',
				ff,
				(now - defaults.now) / 1e3))
		}
	}

	// open database
	// cb(err)
	function open(cb) {
		if (db) throw Error('database already opened')
		mongodb.connect(defaults.dbUrl, defaults.dbOpts, function (err, dbx) {
			if (!err) {
				if (!dbx) throw Error('got null db')
				else {
					db = dbx
					self.db = db
				}
			} else log('mongodb.connect:' + errorString(err))

			cb(err)
		})
	}

	function setState(state, cb) {
		var c
		var recordNo = 0

		hasCollection(function(err, exists) {
			if (!err) {
				if (exists) {

					// drop the existing collection
					db.dropCollection(defaults.collection, function (err, bool) {
						if (!err) createCollection()
						else cb(err)
					})
				} else createCollection()
			} else cb(err)
		})

		function createCollection() {
			db.collection(defaults.collection, function(err, collection) {
				if (!err) {
					c = collection
					writeRecord()
				} else cb(err)
			})
		}

		function writeRecord() {
			if (recordNo < state.length) {
				var doc = state[recordNo++]
				c.insert(doc, {safe: true}, function (err, v) {
					if (!err) {
						writeRecord()
					} else cb(err)
				})
			} else cb(null, c)
		}
	}

	// get the collection state cb(err, data)
	// exactly one callback, either with err or:
	// data: null: collection does not exist
	// data: array: each record
	function getState(cb) {
		hasCollection(function(err, exists) {
			if (!err) {
				if (exists) {

					// read the entire collection
					// forward to cb(err, array)
					db.collection(defaults.collection).find().toArray(cb)
				} else cb(err, null)
			} else cb(err)
		})
	}

	// cb(err, boolean)
	function hasCollection(cb) {
		db.collections(function(err, collections) {
			var result = false
			if (!err) {
				result = collections.some(function (c) {
					return c.collectionName == defaults.collection
				})
			}
			cb(err, result)
		})
	}

	// close database if open
	// cb: optional callback(err)
	function close(cb) {
		if (db) {
			var dbx = db
			db = null
			self.db = null
			dbx.close(function(err) {
				if (!err) log('db.close successful')
				else log('db.close:' + errorString(err))
				if (cb) cb(err)
			})
		} else if (cb) cb()
	}

	// print an error with discovery location, then continue with cb
	// need a heading and location
	// print the location where the error was discovered
	// print the error like a throw would
	function errCb(err, cb) {
	/*
	printout from regular throw statement:
		Error
	    at Object.errCb (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/modules/mongodb/mongohelper.js:151:8)
	    at dropCollection (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/modules/mongodb/mongocollections.js:164:6)
		throw new Error
	*/
		if (err) {
			haraldutil.logError(err, undefined, log, 1)
		}
		cb(err)
	}
}
function errorString(err) {
	var result = []

	if (!err instanceof Error) {
		result.push('? type:')
		result.push(typeof err)
		result.push('\n')
		result.push(String(err))
	} else {
		result.push(String(err))
	}

	return result.join('')
}
// get a description of the value o
// if object: object: collection
// otherwise type: value:
function getValue(o) {
	var isObject = o != null && typeof o == 'object'
	return isObject ?
		'object:' + o.constructor.name || 'Object' :
		'type:' + typeof o + ' value:' + String(o)
}