// mongocursor.js
// examine operations on a cursor

// cursor has db, collection properties
// selector: {}, fields: undefined, skipValue: 0, limitValue: 0, sortValue: undefined, hint: null, explainValue: undefined,
// snapshot: undefined,  timeout: true,  tailable: undefined,  batchSizeValue: 0,  slaveOk: false,  raw: false,  read: true,
//  returnKey: undefined,  maxScan: undefined,  min: undefined,  max: undefined,  showDiskLoc: undefined,  comment: undefined,
//  totalNumberOfRecords: 0,  items: [],  cursorId: { _bsontype: 'Long', low_: 0, high_: 0 },  state: 0,  queryRun: false,  getMoreTimer: false,
//  collectionName: 'cloudclearing.fb-775861653' }
//
// batchSize close count each explain formatSortValue formattedOrderClause isClosed limit nextObject rewind skip sort stream
// streamRecords toArray

// there is no hasNext function
// rewind only goes back to the very first object

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

module.exports = {
	init: init,
}

// conclusions from mongodbconnect.js
var params = {
	connectUrl: 'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing',
	connectOpts: {},//{ssl: true},
	collection: 'fb-775861653',
}

var db
var defaults

init(params, function(err) {
	if (err) throw err

	var cursor = db.collection(defaults.collection).find()
	toArray(cursor, shutDown)
	//count(cursor, function (err) {
	//	if (err) throw err
	//	each(cursor, shutDown)
	//})

	//shutDown()

})

function toArray(cursor, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	// toArray must have a callback, the cursor is closed
	cursor.toArray(function (err, arr) {
		 if (!err) {
		 	console.log(str, cursor.isClosed())
		 	console.log(str, arr.length)
		 	cb()
		 } else cb(err)
	})
	console.log(str, 'End')
}

function each(cursor, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	// each must have be provided a callback(err, item)
	// the final callback has err non-null, or both arguments null
	// the code continues past the each statement before all calbacks have executed
	// the cursor is closed at the end
	var s = 0
	console.log(str, cursor.isClosed())
	cursor.each(function (err, document) {
		 if (!err) {
		 	if (document == null) {
		 		console.log(str, cursor.isClosed())
		 		console.log(str, 'invocations:', s)
		 		cb()
		 	}
		 	if (s == 0) logValue(document, str)
		 	s++
		 } else cb(err)
	})
	console.log(str, 'End')
}

function count(cursor, cb) {
	// count must have a callback, second argument is number
	cursor.count(function (err, number) {
		if (!err) {
			console.log(number)
			cb()
		} else cb(err)
	})
}


function logValue(x, str) {
	var isObject = x != null && typeof x == 'object'
	var value = isObject ? 'object:' + x.constructor.name : x
	if (str) console.log(str, value)
	else console.log(value)
}	

// closeDb with error logging
function shutDown(err) {
	if (err) console.log('error:', err)
	closeDb(function (err) {
		if (err) console.log('close error:', err)
		console.log('end of program')
	})
}

// receive defaults, open the database
function init(defaultsx, cb) {
	defaults = defaultsx
	if (!db) {
		mongodb.connect(defaults.connectUrl, defaults.connectOpts, function (err, dbx) {
			if (!err) {
				db = dbx
				if (cb) cb()
			} else {
				if (cb) cb(err)
				else throw err
			}
		})
	} else if (cb) cb()
}

function closeDb(cb) {
	if (db) {
		var aDb = db
		db = undefined
		aDb.close(function(err) {
			if (cb) cb(err)
			else if(err) console.log('close error:', err)
		})
	} else if (cb) cb(null)
}
