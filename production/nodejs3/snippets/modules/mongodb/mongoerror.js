// mongoerror.js
// how to discover errors with mongo

/*
conclusions:

1. we must use safe:true, otherwise we will not get timely errors
2. the main codepath continues without waiting for the callback
3. a counter verifies that all callbacks have concluded
4. anomaly has a timer for each db request not completing within 3 seconds

*/
var defaults = {
	funcs: [
		insertDuplicate,
	],
}

var dbs = {
	db0: [
		{ _id: 1, text: 'text', },
	],
	db1: [
		{ _id: 1, text: 'text2', },
	],
}

var dbo = require('./mongohelper').get(defaults)
dbo.start()

function insertDuplicate(cb) {
	var func = arguments.callee.name

	// initialize state
	dbo.setState(dbs.db0, function (err, c) {
		if (!err) {
			if (false) {
				// insert a duplicate (ie. error) without safe: true
				var doc = dbs.db1[0]
				c.insert(doc, {}, function (err, v) {
					if (!err) {
						// v becomes an array of 1 element, the new object that failed to get written
						// insertDuplicate object:Array [ { _id: 1, text: 'text2' } ]
						console.log(func, dbo.getValue(v), v)
						cb()
					} else dbo.errCb(err, cb)
				})
			} else {
				// insert a duplicate (ie. error) with safe: true
				var doc = dbs.db1[0]
				c.insert(doc, {safe: true}, function (err, v) {
					if (!err) {
						// err: MongoError: E11000 duplicate key error index: harald.test.$_id_  dup key: { : 1 }
						console.log(func, dbo.getValue(v), v)
						cb()
					} else dbo.errCb(err, cb)
				})

			}
		}
		else dbo.errCb(err, cb)
	})

	function printState() {

		dbo.getState(function (err, data) {
			if (!err) {
				console.log(data)
			}
			dbo.errCb(err, cb)
		})
	}
}