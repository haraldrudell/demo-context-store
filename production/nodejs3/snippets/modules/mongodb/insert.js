// insert.js
// Demonstrate insert
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
Inserts a single document or a an array of documents

insert(docs[, options][, callback])
doc: fields and values to be updated
options: optional object
callback(err, docs): optional function
docs: array of documents

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#insert
*/
var mongofixture = require('./mongofixture')

var fns = [insertOne, insertTwo, insertDuplicate, insertCustomUuid]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

function notFound(collection, cb) {
	collection.findAndModify({id: 1}, result)

	/*
	null, null, {value: null, ok: 1}
	*/
	function result(err, v0, v1) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

/*
null,
[{
	a: 1,
	_id: object:ObjectID {_bsontype: 'ObjectID', id: 'Q\u001c\u0017q\u00bfG\u00b8\u00d7g\u0000\u0000\u0001'}
}]
*/
function insertOne(collection, cb) {
	var self = this
	collection.insert({a: 1}, result)

	function result(err, docs) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		// { a: 1, _id: 511c1771bf47b8d767000001 }
		self.printCollection(cb)
	}
}

/*
null
[{
	a: 1,
	_id: object:ObjectID {_bsontype: 'ObjectID', id: 'Q\u001c\u0018H\u0010`\u001e\u00f1g\u0000\u0000\u0002'}
}, {
	a: 2,
	_id: object:ObjectID {_bsontype: 'ObjectID', id: 'Q\u001c\u0018H\u0010`\u001e\u00f1g\u0000\u0000\u0003'}
}]
*/
function insertTwo(collection, cb) {
	var self = this
	collection.insert([{a: 1}, {a:2}], result)

	function result(err, docs) {
		if (err) throw err
		require('haraldutil').pargs(arguments)

		/*
		1 { a: 1, _id: 511c184810601ef167000002 }
		2 { a: 2, _id: 511c184810601ef167000003 }
		*/
		self.printCollection(cb)
	}
}

/*
A duplicate insert is ignored
This can not be observed by the caller
*/
function insertDuplicate(collection, cb) {
	var self = this
	var _id
	collection.insert({a: 1}, result)

	function result(err, docs) {
		if (err) throw err
		_id = docs[0]._id
		self.printCollection(insertSecond)
	}

	function insertSecond(err) {
		if (err) throw err
		else collection.insert({a: 2, _id: _id}, result2)
	}

	function result2(err, docs) {
		require('haraldutil').pargs(arguments)
		if (err) throw err

		/*
		1 { a: 1, _id: 511c184810601ef167000002 }
		2 { a: 2, _id: 511c184810601ef167000003 }
		*/
		self.printCollection(cb)
	}
}

/*
If a new record has _id, that will be used
*/
function insertCustomUuid(collection, cb) {
	var self = this
	var _id
	collection.insert({a: 1, _id: '1234'}, result)

	/*
	insert:125:result null, 1[{a: 1, _id: '1234'}]
	*/
	function result(err, docs) {
		require('haraldutil').pargs(arguments)
		if (err) throw err
		/*
		1 { a: 1, _id: '1234' }
		*/
		self.printCollection(cb)
	}
}
