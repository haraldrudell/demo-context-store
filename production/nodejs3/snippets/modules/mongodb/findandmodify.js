// findandmodify.js
// Demonstrate findAndModify
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

/*
Manipulates the first found record

findAndModify(query, sort, doc[, options], callback)
doc: fields and values to be updated
options: optional object
.remove
.upsert: inserts if query had no results
.new?
callback(err, v0, v1)
v0: result or null on error
v1: ?

http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#findandmodify
*/
var mongofixture = require('./mongofixture')

var fns = [find0, modify1]
var log = console.log

mongofixture.getFixture({fns: fns}, done)

function done(err) {
	if (err) throw err
}

/*
find and modify where query matches no documents
*/
function find0(collection, cb) {
	collection.findAndModify({id: 1}, result)

	/*
	null, null, {value: null, ok: 1}
	*/
	function result(err, v0, v1) {
//debugger
		if (err) throw err
		require('haraldutil').pargs(arguments)
		cb()
	}
}

/*
find and modify where query matches one document
*/
function modify1(collection, cb) {
	var self = this
	collection.insert([{a: 1, b: 1}, {a: 2, b: 2}], update)

	function update(err, docs) {
		if (err) throw err
		collection.findAndModify({a: 2}, [], {$set: {c: 1, b: 3}}, result)
	}

	/*
	null,
	{a: 2, b: 2, _id: 'd304f2fb-4c65-42f3-b99a-5e63f2f433e1'},
	{
		lastErrorObject: {updatedExisting: true, n: 1, connectionId: 19, err: null, ok: 1},
		value: {a: 2, b: 2, _id: 'd304f2fb-4c65-42f3-b99a-5e63f2f433e1'},
		ok: 1}
	*/
	function result(err, result) {
		if (err) throw err
		require('haraldutil').pargs(arguments)
		/*
		1 { a: 1, b: 1, _id: 'aae1ad5a-594b-4710-809c-0cccdd4c89ba' }
		2 { _id: 'ac6a6b5c-b836-467e-9eba-b18b64569869', a: 2, b: 3, c: 1 }
		*/
		self.printCollection(cb)
	}
}
