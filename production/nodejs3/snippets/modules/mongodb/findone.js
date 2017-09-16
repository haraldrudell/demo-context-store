// findone.js
// Demonstrate findOne
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
Returns zero or one document

findOne(query[, options], callback)
doc: fields and values to be updated
options: optional object
callback(err, doc)

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#findone
*/
var mongofixture = require('./mongofixture')

var fns = [notFound, found1, found2]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

function notFound(collection, cb) {
	collection.findOne({id: 1}, result)

	/*
	null, null
	*/
	function result(err, doc) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

function found1(collection, cb) {
	collection.insert({a: 1}, result)

	function result(err) {
		if (err) throw err
		collection.findOne(result0)
	}

	/*
	null, {a: 1, _id: '0f447c13-f500-4702-ab7f-880d2065eb7a'}
	*/
	function result0(err, doc) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

function found2(collection, cb) {
	collection.insert([{a: 1}, {a: 2}], result)

	function result(err) {
		if (err) throw err
		collection.findOne(result0)
	}

	/*
	null, {a: 1, _id: '0f447c13-f500-4702-ab7f-880d2065eb7a'}
	*/
	function result0(err, doc) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}
