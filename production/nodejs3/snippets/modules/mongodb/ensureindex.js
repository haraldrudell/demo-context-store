// ensureindex.js
// Demonstrate findOne
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
If unique index, offensing inserts are ignored

ensureIndex(fieldOrSpec[, options], callback)
fieldOrSpec
options: optional object
unique: boolean?
sparse: boolean?
background: boolean
dropDups: boolean, default false
min, max, v, expireAfterSeconds, name
callback(err, result)

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#ensureindex
*/
var mongofixture = require('./mongofixture')

var fns = [ensureIndex, indexDuplicates, enforceIndex]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

function ensureIndex(collection, cb) {
	collection.ensureIndex({id: 1}, result)

	/*
	null, 'id_1'
	*/
	function result(err, indexName) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

function indexDuplicates(collection, cb) {
	collection.insert([{a: 1}, {a: 1}], result)

	function result(err, docs) {
		if (err) throw err
		collection.ensureIndex({a: 1}, {unique: true}, result2)
	}

	/*
	null, 'id_1'
	*/
	function result2(err, indexName) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

function enforceIndex(collection, cb) {
	var self = this
	collection.indexInformation(maybeIndex)

	function maybeIndex(err, indexes) {
		if (err) throw err
		if (!Object.keys(indexes).length) collection.ensureIndex({a: 1}, {unique: true}, hasIndex)
		else hasIndex()
	}

	function hasIndex(err, indexName) {
		if (err) throw err
		collection.insert([{a: 1}, {a: 1}], result)
	}

	function result(err, docs) {
		if (err) throw err
		// null, 2[{a: 1, _id: '0d2e7f4f-ad0c-4ab1-882b-aedc3ae9c24e'}, {a: 1, _id: 'd0b205d3-7f93-4086-8933-5b9b81245668'}]
		require('haraldutil').pargs(arguments)
		// 1 { a: 1, _id: '0d2e7f4f-ad0c-4ab1-882b-aedc3ae9c24e' }
		self.printCollection(cb)
	}
}
