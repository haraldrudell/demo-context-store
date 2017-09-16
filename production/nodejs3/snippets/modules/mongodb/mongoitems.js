// mongoitems.js
// examine and manipulate documents in a collection

// question: should I maintain my own collection object? no. just use db.collection('name').find
// therefore, we will have an init that connects to the database
// http://www.mongodb.org/display/DOCS/node.JS

// program does not exit until db is closed

// collection actions:
// count
// createIndex, dropAllIndexes, dropIndex, dropIndexes, ensureIndex, indexExist, indexInformation, indexes, reIndex
// distinct
// drop, remove, rename, save, update
// find, findAndModify, findAndRemove, findOne
// insert
// geoHayStackSearch, geoNear, isCapped, mapReduce

// collection.find()
/**
 * Creates a cursor for a query that can be used to iterate over results from MongoDB
 *
 * Various argument possibilities
 *  - callback?
 *  - selector, callback?,
 *  - selector, fields, callback?
 *  - selector, options, callback?
 *  - selector, fields, options, callback?
 *  - selector, fields, skip, limit, callback?
 *  - selector, fields, skip, limit, timeout, callback?
 *
 * Options
 *  - **limit** {Number, default:0}, sets the limit of documents returned in the query.
 *  - **sort** {Array | Object}, set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
 *  - **fields** {Object}, the fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
 *  - **skip** {Number, default:0}, set to skip N documents ahead in your query (useful for pagination).
 *  - **hint** {Object}, tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
 *  - **explain** {Boolean, default:false}, explain the query instead of returning the data.
 *  - **snapshot** {Boolean, default:false}, snapshot query.
 *  - **timeout** {Boolean, default:false}, specify if the cursor can timeout.
 *  - **tailable** {Boolean, default:false}, specify if the cursor is tailable.
 *  - **batchSize** {Number, default:0}, set the batchSize for the getMoreCommand when iterating over the query results.
 *  - **returnKey** {Boolean, default:false}, only return the index key.
 *  - **maxScan** {Number}, Limit the number of items to scan.
 *  - **min** {Number}, Set index bounds.
 *  - **max** {Number}, Set index bounds.
 *  - **showDiskLoc** {Boolean, default:false}, Show disk location of results.
 *  - **comment** {String}, You can put a $comment field on a query to make looking in the profiler logs simpler.
 *  - **raw** {Boolean, default:false}, Return all BSON documents as Raw Buffer documents.
 *  - **read** {Boolean, default:false}, Tell the query to read from a secondary server.
 *
 * @param {Object} query query object to locate the object to modify
 * @param {Object} [options] additional options during update.
 * @param {Function} [callback] optional callback for cursor.
 * @return {Cursor} returns a cursor to the query
 * @api public
 */

// findAndModify
/**
 * Find and update a document.
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a getLastError command returning the results of the command on MongoDB.
 *  - **remove** {Boolean, default:false}, set to true to remove the object before returning.
 *  - **upsert** {Boolean, default:false}, perform an upsert operation.
 *  - **new** {Boolean, default:false}, set to true if you want to return the modified object rather than the original. Ignored for remove.
 *
 * @param {Object} query query object to locate the object to modify
 * @param {Array}  sort - if multiple docs match, choose the first one in the specified sort order as the object to manipulate
 * @param {Object} doc - the fields/vals to be updated
 * @param {Object} [options] additional options during update.
 * @param {Function} [callback] returns results.
 * @return {null}
 * @api public
 */
//Collection.prototype.findAndModify = function findAndModify (query, sort, doc, options, callback) {

 // findOne
 /**
 * Finds a single document based on the query
 *
 * Various argument possibilities
 *  - callback?
 *  - selector, callback?,
 *  - selector, fields, callback?
 *  - selector, options, callback?
 *  - selector, fields, options, callback?
 *  - selector, fields, skip, limit, callback?
 *  - selector, fields, skip, limit, timeout, callback?
 *
 * Options
 *  - **limit** {Number, default:0}, sets the limit of documents returned in the query.
 *  - **sort** {Array | Object}, set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
 *  - **fields** {Object}, the fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
 *  - **skip** {Number, default:0}, set to skip N documents ahead in your query (useful for pagination).
 *  - **hint** {Object}, tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
 *  - **explain** {Boolean, default:false}, explain the query instead of returning the data.
 *  - **snapshot** {Boolean, default:false}, snapshot query.
 *  - **timeout** {Boolean, default:false}, specify if the cursor can timeout.
 *  - **tailable** {Boolean, default:false}, specify if the cursor is tailable.
 *  - **batchSize** {Number, default:0}, set the batchSize for the getMoreCommand when iterating over the query results.
 *  - **returnKey** {Boolean, default:false}, only return the index key.
 *  - **maxScan** {Number}, Limit the number of items to scan.
 *  - **min** {Number}, Set index bounds.
 *  - **max** {Number}, Set index bounds.
 *  - **showDiskLoc** {Boolean, default:false}, Show disk location of results.
 *  - **comment** {String}, You can put a $comment field on a query to make looking in the profiler logs simpler.
 *  - **raw** {Boolean, default:false}, Return all BSON documents as Raw Buffer documents.
 *  - **read** {Boolean, default:false}, Tell the query to read from a secondary server.
 *
 * @param {Object} query query object to locate the object to modify
 * @param {Object} [options] additional options during update.
 * @param {Function} [callback] optional callback for cursor.
 * @return {Cursor} returns a cursor to the query
 * @api public
 */
//Collection.prototype.findOne = function findOne () {

// cursor.toArray()
/**
 * Returns an array of documents. The caller is responsible for making sure that there
 * is enough memory to store the results. Note that the array only contain partial
 * results when this cursor had been previouly accessed. In that case, 
 * cursor.rewind() can be used to reset the cursor.
 *
 * @param {Function} callback This will be called after executing this method successfully. The first paramter will contain the Error object if an error occured, or null otherwise. The second paramter will contain an array of BSON deserialized objects as a result of the query.
 * @return {null} 
 * @api public
 */
//Cursor.prototype.toArray = function(callback) {


// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

module.export = {
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

	//count(shutDown)
	//findOneNoCb(shutDown)
	findNoCb(shutDown)
	//find(shutDown)
	//findOne(shutDown)
	//examineCollection(defaults.collection)//, shutDown)

	//shutDown()

})

function count(cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var c = db.collection(defaults.collection)

	// count must have a callback, may have a leading query
	// second argument is number
	c.count(function (err, number) {
		if (!err) {
			console.log(str, number)
			cb()
		} else cb(err)
	})
}


function findNoCb(cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var c = db.collection(defaults.collection)

	// returns undefined, then crashes
	var x = c.find()
	logValue(x, str)
	cb()
}

function find(cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var c = db.collection(defaults.collection)

	// Collection.find() looks iffy without a callback
	// we will get exactly one callback
	// second argument is Cursor
	c.find(function (err, x) {
		if (!err) {
			//console.log(x)
			logValue(x, str)
			cb()
		} else cb(err)
	})
}

/* findAndModify
if query is matched:
v1 is the previous version of the record
v2 {"lastErrorObject": {
		"updatedExisting":true,"n":1,"connectionId":90204, "err":null,"ok":1
	},
	"value":{
		"_id":"94c51b35-4709-4cee-82e2-236b217161c2","id":"775861653","fb":{"accessToken":"AAABZBxDSzQesBAKhp2nyfKZAYnlWtLctVmcJrFiLcsq6SxRnT5srpXUwaNi8Lquw4r3IgQO3R4c3iEjlysv75tBnZAfC59FMyOXiDkuewZDZD","expires":"5171872","id":"775861653","name":"Harald Rudell","firstName":"Harald","scope":"email","timestamp":1341276920},"created":1341276920},
	"ok":1}

if query is not matched:
v1 null
v2 {"value":null,"ok":1}
*/

function findOneNoCb(cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var c = db.collection(defaults.collection)

	// Collection.findOne() looks iffy without a callback
	// we will get exactly one callback
	// second argument is a stored document (Object object)
	var x = c.findOne()
	logValue(x, str)
	cb()
}

function findOne(cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var c = db.collection(defaults.collection)

	// Collection.findOne() looks iffy without a callback: return undefined and mongo crashes
	// we will get exactly one callback
	// second argument is a stored document (Object object)
	c.findOne(function (err, x) {
		if (!err) {
			console.log(x, str)
			logValue(x)
			cb()
		} else cb(err)
	})
}

function examineCollection(cName, cb) {
	// find().limit(3)

	// object:Collection
	//logValue(db.collection(cName))
	var c = db.collection(cName)

	// object:Cursor
	//logValue(db.collection(cName).find())

	// toArray: callback is mandatory, return value is undefined
	// how do you know you have got the last document?
	//var docs = 0
	//c.find().toArray(function (err, document) {
	//	if (err) console.log('toArrayerr:', err)
	//	if (docs == 0) logValue(document)
	//	docs++
	//})
	//console.log('docs:', docs)

	// undefined??
	logValue(c.findOne())
	
	console.log('examineEnd')
	if (cb) cb()
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
