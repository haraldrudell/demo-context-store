// remove.js
// Demonstrate remove
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
findAndModify(query, sort, doc[, options], callback)
doc: fields and values to be updated
options: optional object
.upsert: ?
callback(err, v0, v1)
v0: result or null on error
v1: ?

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#findandmodify
*/
var mongofixture = require('./mongofixture')

var fns = [remove0, remove1, remove2]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

function remove0(collection, cb) {
	collection.remove({id: 1}, result)

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

function remove1(collection, cb) {
	var self = this
	collection.insert([{a: 1}, {a: 2}], remove)

	function remove(err, docs) {
		if (err) throw err
		collection.remove({a: 2}, result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		// 1 { a: 1, _id: 'b17f7e10-979b-4e32-bcf4-165e0c6ffb69' }
		self.printCollection(cb)
	}
}

function remove2(collection, cb) {
	var self = this
	collection.insert([{a: 1}, {a: 2}], remove)

	function remove(err, docs) {
		if (err) throw err
		collection.remove(result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		// empty collection
		self.printCollection(cb)
	}
}
