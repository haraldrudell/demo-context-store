// mongoindex.js
// prove that unique indexes work

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var applego = require('applego')

// c.drop: callback optional
// result true on success, otherwise null
// c.drop(callback(err, result))
// drop a collection that does not exist: MongoError: ns not found

// unless you have safe:true on your insert, the insert is silently ignored

/**
 * Ensures that an index exists, if it does not it creates it
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a 
 *  - **unique** {Boolean, default:false}, creates an unique index.
 *  - **sparse** {Boolean, default:false}, creates a sparse index.
 *  - **background** {Boolean, default:false}, creates the index in the background, yielding whenever possible.
 *  - **dropDups** {Boolean, default:false}, a unique index cannot be created on a key that has pre-existing duplicate values. If you would like to create the index anyway, keeping the first document the database indexes and deleting all subsequent documents that have duplicate value
 *  - **min** {Number}, for geospatial indexes set the lower bound for the co-ordinates.
 *  - **max** {Number}, for geospatial indexes set the high bound for the co-ordinates.
 *  - **v** {Number}, specify the format version of the indexes.
 *
 * @param {Object} fieldOrSpec fieldOrSpec that defines the index.
 * @param {Object} [options] additional options during update.
 * @param {Function} callback for results.
 * @return {null}
 * @api public
 */
//Collection.prototype.ensureIndex = function ensureIndex (fieldOrSpec, options, callback) { 

// conclusions from mongodbconnect.js
var defaults = {
	funcs: [
		clearCollection,
		ensureIndex,
		testIndex,
	],
}

var dbs = {
	dbz: [],
}

var dbo = require('./mongohelper').get(defaults)
dbo.start()
var c

var o1 = { id:1}
var o2 = { id:1}

// drop and ensure the collection is empty
function clearCollection(cb) {
	dbo.setState([], function (err, cx) {
		if (!err) {
			c = cx
			cb()
		} else dbo.errCb(err, cb)
	})
}

function ensureIndex(cb) {
	var func = arguments.callee.name

	var t = Date.now()
	// create unique index
	c.ensureIndex(
		{id : 1}, // field id is an index
		{unique: true}, // id is a unique index
		function (err, index_name) {
			if (!err) {
				var elapsed = (Date.now() - t) / 1000
				// index: id_1
				console.log(func, index_name, elapsed)
				cb()
			} else dbo.errCb(err, cb)
	})
}

function testIndex(cb) {
	var rqs = applego.getRqs(end, arguments.callee.name)

	// insert a record with the id field
	rqs.addRq('inserto1')
	c.insert(o1, // the doc
		{safe:true}, // options
		function (err, v) {
			rqs.clearRq('inserto1')
			if (!err) {
				// [ { id: 1, _id: 4ff2361bea0876b73c000001 } ]
				console.log(rqs.func, 'first v:', v)
			}
			end(err)
	})

	// attempt to insert another document with same id
	// it should fail because of our unique index
	var t2 = rqs.addRq()
	c.insert(o2,
		{safe:true},
		function (err, v) {
			rqs.clearRq(t2)
			if (!err) {
				console.log(rqs.func, 'second v:', v)
				end(Error('ensureIndex failed!'))
			} else {
				// testIndex second v: undefined
				//console.log(func, 'second v:', v)
				// MongoError: E11000 duplicate key error index: harald.test.$id_1  dup key: { : 1 }
/*
object:Error {
  name: 'MongoError', 
  err: 'E11000 duplicate key error index: harald.test.$id_1  dup key: { : 1 }', 
  code: 11000, 
  n: 0, 
  lastOp: object:Long {
    _bsontype: 'Long', 
    low_: 3, 
    high_: 1343019762
}, 
  connectionId: 870082, 
  ok: 1, 
  (nonE)arguments: undefined, 
  (nonE)(get)stack: 'MongoError: E11000 duplicate key error index: harald.test.$id_1  dup key: { : 1 }*    at Db.wrap (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/db.js:1675:11)*    at [object Object].<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/collection.js:297:26)*    at [object Object].g (events.js:156:14)*    at [object Object].emit (events.js:88:20)*    at Db._callHandler (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/db.js:1290:25)*    at /home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/connection/server.js:329:30*    at [object Object].parseBody (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/responses/mongo_reply.js:118:5)*    at [object Object].<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/connection/server.js:320:22)*    at [object Object].emit (events.js:67:17)*    at [object Object].<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/mongodb/lib/mongodb/connection/connection_pool.js:147:13)', 
  (nonE)message: 'E11000 duplicate key error index: harald.test.$id_1  dup key: { : 1 }', 
  (nonE)type: undefined
}
*/
//				console.log(haraldutil.inspectAll(err))
				if (err instanceof Error && err.code == 11000) {
					console.log(rqs.func, 'unique index works:', String(err))
					end()
				} else end(err)
			}
	})
/*
	var t3 = rqs.addRq(500)
	setTimeout(function () {
		rqs.clearRq(t3)
		end()
	}, 1100)
*/
	rqs.clearRq(0)

	function end(err) {
		if (err) {
			if (err.code == 17) console.log('There was a timeout')
			else {
				rqs.setCbDone()
				dbo.errCb(err, cb)
			}
		} else if (rqs.isDone()) cb()
	}
}