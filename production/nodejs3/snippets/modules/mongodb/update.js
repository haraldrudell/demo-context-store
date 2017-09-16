// update.js
// Demonstrate update
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
update(selector, document[, options][, callback])
doc: fields and values to be updated
options: optional object
.upsert: ?
.multi?
callback(err, v0, v1)
v0: result or null on error
v1: ?

neither selector or document: exception
only selector: hang

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#update
*/
var mongofixture = require('./mongofixture')

var fns = [replace1, update1, insert1, updateMany, inAndSet]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

/*
function replace1 and update1

multiple-match query, multi false, upsert: any
doc has no $ properties: replaces first db-doc found with doc
doc has only $ properties: executes $ properties on existing db-doc
doc has both $ and regular properties: does nothing
*/
function replace1(collection, cb) {
	var self = this
	collection.insert([{a: 1, b: 1}, {a: 2, b: 2}], update)

	function update(err, docs) {
		if (err) throw err
		collection.update({}, {c: 1}, result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		/*
		1 { _id: 'c48ee455-9d88-48b0-baf6-778dce96de10', c: 1 }
		2 { a: 2, b: 2, _id: '1263377f-bc4c-40b1-b84e-14518252d9e4' }
		*/
		self.printCollection(cb)
	}
}

function update1(collection, cb) {
	var self = this
	collection.insert([{a: 1, b: 1}, {a: 2, b: 2}], update)

	function update(err, docs) {
		if (err) throw err
// does nothing:		collection.update({}, {c: 1, $set: {d: 1}}, result)
		collection.update({}, {$set: {c: 1}}, result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		/*
		1 { a: 2, b: 2, _id: 'f7246d93-0ee4-42dc-8112-2754112aab6b' }
		2 { _id: '95896b3e-47f4-462b-bdba-1a7bfe83396a', a: 1, b: 1, c: 1 }
		*/
		self.printCollection(cb)
	}
}

/*
unmatched query, multi: any
upsert false: Does nothing
upsert true: inserts doc: can only have either regular properties or $ properties
doc has regular properties and $ properties: does nothing
*/
function insert1(collection, cb) {
	var self = this
	collection.insert([{a: 1, b: 1}, {a: 2, b: 2}], update)

	function update(err, docs) {
		if (err) throw err
// does nothing		collection.update({a: 3}, {$set: {d: 1}}, {}, result)
// does nothing		collection.update({a: 3}, {c: 1, $set: {d: 1}}, {upsert: true}, result)
		collection.update({a: 3}, {$set: {d: 1}}, {upsert: true}, result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		/*
		1 { _id: '8145f854-c540-44e0-aa01-9ab833216e39', c: 1 }
		2 { a: 2, b: 2, _id: 'cc591864-9cda-4178-9d43-b30c7dcc6982' }
		*/
		self.printCollection(cb)
	}
}

/*
multiple-match query, multi: true, upsert: any
doc with only $-properties: applied to all matching db-docs
doc has both $ and regular or only regular properties: does nothing
*/
function updateMany(collection, cb) {
	var self = this
	collection.insert([{a: 1, b: 1}, {a: 2, b: 2}], update)

	function update(err, docs) {
		if (err) throw err
// does nothing		collection.update({}, {c: 1, $set: {d: 1}}, {multi: true}, result)
// does nothing		collection.update({}, {c: 1}, {multi: true}, result)
		collection.update({}, {$set: {d: 1}}, {multi: true}, result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		/*
		1 { _id: 'aa94a17a-cc26-40f3-bf24-e4e85a79b644', a: 1, b: 1, d: 1 }
		2 { _id: '26d3410f-c981-44a3-bb3d-8341b6bf58d7', a: 2, b: 2, d: 1 }
		*/
		self.printCollection(cb)
	}
}

/*
in and set: does nothing
*/
function inAndSet(collection, cb) {
	var self = this
	collection.insert([{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}], update)

	function update(err, docs) {
		if (err) throw err
		var ids = [docs[0]._id, docs[2]._id, docs[3]._id]
		collection.update({_id: {$in: ids}}, {$set: {lost: 17}}, {multi: true}, result)
	}

	/*
	(nothing printed)
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		/*
1 { a: 2, _id: '77d72c17-af72-4144-a74b-7c61f7106630' }
2 { a: 5, _id: '26f974c7-7f0b-4712-9a95-7fb433a6d119' }
3 { _id: '814b6424-d530-4871-82bd-3eaab0a5b723', a: 3, lost: 17 }
4 { _id: 'b073e6d6-0054-4ae0-9ce5-035788359010', a: 1, lost: 17 }
5 { _id: 'c2354eae-1403-4f03-a751-802d6e355163', a: 4, lost: 17 }
		*/
		self.printCollection(cb)
	}
}
