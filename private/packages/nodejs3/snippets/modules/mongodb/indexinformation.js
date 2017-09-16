// indexinformation.js
// Demonstrate findOne
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
Returns zero or one document

indexInformation([options], callback)
options: optional object: not used
callback(err, result)

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#indexinformation
*/
var mongofixture = require('./mongofixture')

var fns = [empty, one]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

function empty(collection, cb) {
	collection.indexInformation(result)

	/*
	null, {}
	*/
	function result(err, indexName) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

function one(collection, cb) {
	collection.insert({a:1}, createIndex)

	function createIndex(err, docs) {
		if (err) throw err
		collection.ensureIndex({unique: true}, getInformation)
	}

	function getInformation(err, indexName) {
		if (err) throw err
		collection.indexInformation(result)
	}

	/*
	null, {_id_: 1[2['_id', 1]], unique_true: 1[2['unique', true]]}
	*/
	function result(err, indexName) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}
