// find.js
// Demonstrate find
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*


find(query[, options], callback)
options: optional object
.limit
.sort
.fields
.skip
...
callback(err, cursor)

if query is array, does nothing

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#find
*/
var mongofixture = require('./mongofixture')

var fns = [find0, find2, find3, findLt, findFields]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

// find with no result
function find0(collection, cb) {
	var self = this
	collection.find({id: 1}, result)

	function result(err, cursor) {
		if (err) throw err
		var isCursor = cursor instanceof self.mongodb.Cursor
		if (isCursor) cursor.count(countResult)
		else {
			log('cursor is not cursor')
			cb()
		}
	}

	// Cursor count: number 0
	function countResult(err, count) {
		if (err) throw err
		log('Cursor count:', typeof count, count)
		cb()
	}
}

// find with multiple matches
function find2(collection, cb) {
	var self = this
	collection.insert([{a: 1}, {a: 2}], find)

	function find(err, docs) {
		if (err) throw err
		collection.find(result)
	}

	/*
	'data' 'end' 'error' 'close'
	*/
	function result(err, cursor) {
		if (err) throw err
		var s = cursor.stream()
			.on('data', data)
			.once('end', cb)
	}

	/*
	{a: 1, _id: '558b3951-93f6-4df1-8a32-7a93c6093d98'}
	{a: 2, _id: 'd2bf082f-a148-43c5-b46e-0831c2d0215f'}
	*/
	function data(doc) {
		log(doc)
	}
}

// find using list of values
function find3(collection, cb) {
	var self = this
	collection.insert([{a: 1}, {a: 2}, {a: 3}], find)

	function find(err, docs) {
		if (err) throw err
		collection.find({a: {$in: [2, 3]}}, result)
	}

	/*
	'data' 'end' 'error' 'close'
	*/
	function result(err, cursor) {
		if (err) throw err
		var s = cursor.stream()
			.on('data', data)
			.once('end', cb)
	}

	/*
	{a: 1, _id: '558b3951-93f6-4df1-8a32-7a93c6093d98'}
	{a: 2, _id: 'd2bf082f-a148-43c5-b46e-0831c2d0215f'}
	*/
	function data(doc) {
		log(doc)
	}
}

/*
Find a fields less than or missing
*/
function findLt(collection, cb) {
	var self = this
	collection.insert([{a: 1, b: 1}, {a: 2, b: 3}, {a: 3}], find)

	function find(err, docs) {
		if (err) throw err
		collection.find({$or: [{b: {$lt: 2}}, {b: {$exists: false}}]}, result)
	}

	/*
	'data' 'end' 'error' 'close'
	*/
	function result(err, cursor) {
		if (err) throw err
		var s = cursor.stream()
			.on('data', data)
			.once('end', cb)
	}

	/*
	{a: 1, _id: '558b3951-93f6-4df1-8a32-7a93c6093d98'}
	{a: 2, _id: 'd2bf082f-a148-43c5-b46e-0831c2d0215f'}
	*/
	function data(doc) {
		log(doc)
	}
}

/*
Find with field seclector
*/
function findFields(collection, cb) {
	var self = this
	collection.insert([{a: 1, b:1, c:1}, {a: 2, b:2, c:2}], find)

	function find(err, docs) {
		if (err) throw err
		collection.find({}, {fields: {a: 1}}, result)
	}

	/*
	'data' 'end' 'error' 'close'
	*/
	function result(err, cursor) {
		if (err) throw err
		var s = cursor.stream()
			.on('data', data)
			.once('end', cb)
	}

	/*
{ a: 1, _id: '2de0bb27-ac00-430d-b876-b31f63309065' }
{ a: 2, _id: 'bed4098f-f1ff-462a-a4b0-a89d9f1af7e3' }
	*/
	function data(doc) {
		log(doc)
	}
}
