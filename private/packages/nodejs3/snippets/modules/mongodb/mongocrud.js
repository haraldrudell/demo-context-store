// mongocrud.js

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

// https://github.com/broofa/node-uuid
var uuid = require('./uuid').uuid

// how do I enforce unique id? by adding an index. This overwrites, not creating errors
// how do I replace a document rather than merge properties? use upsert option with findAndModify

// conclusions
// 1. create records using insert
// 1a. when inserting, use safe:true to prevent data loss
// 1b. When inserting, ensure that _id and any other unique index does not collide
// 1c. insert errors if a _id record already exists
// 2. For update use findAndModify
// 2a. Error if not existing, replace existing record: 
// 2b. Create if not existing, replace existing record: this is insert
// 2c. 
// 3. update

// we want to create, update, read, and delete
// we have insert, findAndModify and find operations
// findAndRemove and findOne are aliases
// a successful insert always creates a record. unique key indexes can cause insert to fail.
// other than insert, a record can not be created
// a record can only be removed using findAndModify with remove:true
// the record is only removed if there is exactly one match
// safe:true is beneficial to make sure that data is actually saved
// updating:
// upsert true or false
// one or multiple matches
// _id matching or not
// existing record is only merged to if _id matches and upsert is true
// merge only happens if _id are same and upsert is true
// overwrite only happens

// a matching _id record may exist or not exist
// for findAndModify, there might be no, one or multiple maches to the search
// for findAndModify, if _id is set, there might exist an _id already


// the easiest way to find unique item is findOne() using callback
// uuid are better than mongodb's id, because they can be moved between databases

// insert
// doc or doc array
// options: safe keepGoing, serializeFunctions
// safe and struct must have callback

// conclusions from mongodbconnect.js
var params = {
	connectUrl: 'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing',
	connectOpts: {},//{ssl: true},
	testCollection: 'test',
}

var db
var defaults

init(params, function(err) {
	if (err) throw err

	var c = db.collection(defaults.testCollection)

	// fixture: delete the test collection
	var funcs = [ drop, setIndex,
		create,
		read, printCollection,
		exploreFindAndModify, printCollection,
		//exploreInsert, printCollection,
		update, printCollection,
		deleteDo, printCollection ]

	doNextFunc()
	function doNextFunc(err) {
		if (!err) {
			f = funcs.shift()
			if (f) f(c, doNextFunc)
			else shutDown()
		} else {
			shutDown(err)
		}
	}
})

function setIndex(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	// fieldOrSpec, options, calllback
	// safe or strict options require callback
	// options: unique, sparse, background, dropDups
	// v version, min max for geo
	// second argument is short string naming the index
	c.ensureIndex({id : 1}, {unique: true}, function (err, index_name) {
		if (err) cb(err)
		console.log(str, 'index name:', index_name)
		// must have a callback
		// second argument is array of Object objects:
		// properties key, name _id_, ns: cloudclearing.test (the collection name), v: 1
		// key is an object whose single property is the field name being indexed
		c.indexes(function (err, indexes) {
			if (!err) {
				var s = []
				indexes.forEach(function (index) {
					s.push(index.name)
				})
				console.log(str, 'indexes:', s.join(','))
				cb()
			} else cb(err)
		})
	})
}

var doc1_id

function create(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	// what is the default schema?

	// because these have the same id, we want no duplicates
	var doc1 = { name: 'doc1name', same: true, lastname: 'doc1last', id: 1, _id: uuid() }
	var doc2 = { name: 'doc2name', same: true, lastname: 'doc2last', id: 1, _id: uuid() }
	doc1_id = doc1._id

	// create records
	// return value: collection
	//logValue(c.insert(doc1), str)
	//logValue(c.insert(doc2), str)
	c.insert(doc1, {safe: true}, function (err, v) {
		if (err) cb(err)
		else {
			c.insert(doc2, {safe: true}, function (err, v) {
				// returns the inserted values or array of values
				if (!err) checkdb()
				else {
					// error: { [MongoError: E11000 duplicate key error index: cloudclearing.test.$id_1  dup key: { : 1 }]
  					//name: 'MongoError',
  					//err: 'E11000 duplicate key error index: cloudclearing.test.$id_1  dup key: { : 1 }',
  					//code: 11000,
  					//n: 0, lastOp: { _bsontype: 'Timestamp', low_: 4, high_: 1339390469 }, connectionId: 1431525, ok: 1 }
  					doc2.id = 2
  					c.insert(doc2, {safe: true}, function (err, v) {
						if (!err) checkdb()
						else cb(err)
  					})
				}
			})
		}
	})

	function checkdb() {
		// verify that object did not change
		// mongo does in fact add the _id poroperty
		console.log(str, doc1)
		// check how many records we have
		c.find().count(function(err, num) {
			if (!err) {
				if (num != 2) cb (Error('Bad count:' + num))
				else cb()
			} else cb(err)
		})
	}
}

function read(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	var theDoc
	// we must in fact read to the end to make sure no duplicates
	c.findOne({id: 1}, function(err, doc) {
		if (!err) {
			console.log(str, doc)
			cb()
		} else cb(err)
	})
}

// conclusion: for insert use safe, otherwise you may have objects that are not saved
function exploreInsert(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	// remove: default false. if true, a found docuement is removed from the database
	// upsert: default false. if true, ?creates non-existing object
	same_Id(function () {
		cb()
	})

	// a matching record is not found, a new record is inserted
	function notFound(next) {
		c.insert({ id: 17,name:'new'}, {safe:true}, function (err, docs) {
			if (!err) {
				console.log(str, 'docs', docs.length)
				next()
			} else cb(err)
		})
	}

	// returns a new record, but it has not been saved
	function sameId(next) {
		c.insert({ id: 1,name:'new'}, {}, function (err, docs) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'docs', docs)
				next()
			} else cb(err)
		})
	}
	// gets error duplicate Key for id
	function sameIdSafeTrue(next) {
		c.insert({ id: 1,name:'new'}, {safe:true}, function (err, docs) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'docs', docs)
				next()
			} else cb(err)
		})
	}
	// gets error duplicate Key for _id
	function same_Id(next) {
		c.insert({ id: 1,_id:doc1_id,name:'new'}, {safe:true}, function (err, docs) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'docs', docs)
				next()
			} else cb(err)
		})
	}

}




// conclusions: remove:true is only effective for exactly 1 match
// if no match and upsert is not true, database is not changed
// if match, the existing record is normally replaced
// - the existing record is only updated if _id matches and upsert is true
// there is no update flag
function exploreFindAndModify(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	// remove: default false. if true, a found docuement is removed from the database
	// upsert: default false. if true, ?creates non-existing object
	//foundUpsertTrue(cb)
	//notFoundUpsertTrue(cb)
	//OneFound_IdSameUpsert(function () {
		//foundMultipleMultiTrueRemoveTrue(cb)
		//foundOneRemoveTrue(cb)
		//foundUpsertTrue(cb)
		//notFoundUpsertFalse(cb)
		//foundNoneRemoveTrue(cb)
		//notFoundUpsertFalse(cb)
		foundMultipleNo_IdUpsertTrue(cb)
	//	cb()
	//})

	// fields are updated
	// one match, same _id, upsert true: merge
	function OneFound_IdSameUpsert(next) {
		c.findAndModify({id:1}, [], { _id: doc1_id, extraField:'here', same:false}, {safe:true,upsert:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				next()
			} else cb(err)
		})		
	}


	// existing fields are removed
	// one match, same _id, upsert false: overwrite
	function OneFound_IdSameNoUpsert(next) {
		c.findAndModify({id:1}, [], { _id: doc1_id, extraField:'here', same:false}, {safe:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				next()
			} else cb(err)
		})		
	}

	// a matching record is not found, the database is not changed
	// no match, upsert:false: no change
	function notFoundUpsertFalse(next) {
		c.findAndModify({id:17}, [], { id: 17,name:'no!'}, {safe:true,update:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				next()
			} else cb(err)
		})
	}

	// a matching record is not found, the database is not changed
	// no match, upsert:true: no change
	function notFoundUpsertTrue(next) {
		c.findAndModify({id:17}, [], { id: 17,name:'no!'}, {safe:true,upsert:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				next()
			} else cb(err)
		})
	}

	// note: removes fields that are not in the provided object
	// one match, no _id, upsert: true: overwrite
	function foundUpsertTrue(next) {
		c.findAndModify({id:1}, [], {updateIfExisting:true}, {safe:true,upsert:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				cb()
			} else cb(err)
		})
	}

	// multiple matches
	// found multiple, no _id, upsert: true: overwrite of one record
	function foundMultipleNo_IdUpsertTrue(next) {
		c.findAndModify({same: true}, [], {newfield:'here'}, {upsert:true, safe:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				cb()
			} else cb(err)
		})
	}



	// note: removes fields that are not in the provided object
	// one match, no _id, upsert: false: overwrite
	function foundUpsertFalse(next) {
		c.findAndModify({id:1}, [], {updateIfExisting:true}, {}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				cb()
			} else cb(err)
		})
	}

	// multiple matches
	function foundMultipleMultiTrueRemoveTrue(next) {
		c.findAndModify({same: true}, [], {}, {multi:true, remove:true}, function (err, v1, v2) {
			if (!err) {
				// database was not changed
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				cb()
			} else cb(err)
		})
	}

	// does remove the document
	function foundOneRemoveTrue(next) {
		c.findAndModify({id:1}, [], {}, {remove:true}, function (err, v1, v2) {
			if (!err) {
				// v1 is teh removed document
				console.log(str, 'v1', v1)
				// v2 is  { lastErrorObject: 
				//   { n: 1, lastOp: { _bsontype: 'Timestamp', low_: 23, high_: 1339526276 },
				//     connectionId: 1479845, err: null, ok: 1 },
  				// value: teh removed document
  				// ok:1
				console.log(str, 'v2', v2)
				cb()
			} else cb(err)
		})
	}

	// does not modify the database
	function foundNoneRemoveTrue(next) {
		c.findAndModify({id:17}, [], {}, {remove:true}, function (err, v1, v2) {
			if (!err) {
				// v1 is null
				console.log(str, 'v1', v1)
				// v2 is { value: null, ok: 1 }
				console.log(str, 'v2', v2)
				cb()
			} else cb(err)
		})
	}
}

// either the record has the _id field, or we match our id field
// findAndModify merges properties with the existing record
function update(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var doc1 = { name: 'docnameupdated', id: 1 }
	// queryObject, [sort], doc, options, callback
	// doc: fields/vals to be updated
	// options:
	// safe: 
	// remove: boolean, default false: actually removes the record from the database
	// upsert: replaces the existing document
	// new: return the modified object rather than the original
	// note: must have callback
	c.findAndModify({id : 1}, [], doc1, {upsert:true}, function (err, v1, v2) {
		if (!err) {
			// v1 is the previous database version of the document
			console.log(str, 'v1', v1)
			// v2 has lastErrorObject, value and ok: 1. value is the same as v1
			// v2 { lastErrorObject: { updatedExisting: true,
	     		//		n: 1, lastOp: { _bsontype: 'Timestamp', low_: 1, high_: 1339386498 }, connectionId: 1429975,
     			//		err: null, ok: 1 },
			// value: { name: 'doc1name', lastname: 'doc1last', id: 1, _id: 'b8328d3c-d6a1-4f9b-8459-8d9361aa8afb' },
			// ok: 1 }
			console.log(str, 'v2', v2)
			// doc1 is not changed
			//console.log(str, 'doc1', doc1)
			cb()
		} else cb(err)
	})
}

// delete is findAndModify with multi to delete all matching records, and remove to delete from the database
// multi no longer effective
function deleteDo(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	var doc1 = { name: 'docnameupdated', id: 1 }

	c.findAndModify({id: 1}, [], {}, {multi:true, remove:true}, function (err, v1, v2) {
		if (!err) {
			// v1 is the previous database version of the document
			console.log(str, 'v1', v1)
			// v2 has lastErrorObject, value and ok: 1. value is the same as v1
			// v2 { lastErrorObject: { updatedExisting: true,
	     		//		n: 1, lastOp: { _bsontype: 'Timestamp', low_: 1, high_: 1339386498 }, connectionId: 1429975,
     			//		err: null, ok: 1 },
			// value: { name: 'doc1name', lastname: 'doc1last', id: 1, _id: 'b8328d3c-d6a1-4f9b-8459-8d9361aa8afb' },
			// ok: 1 }
			console.log(str, 'v2', v2)
			// doc1 is not changed
			//console.log(str, 'doc1', doc1)
			cb()
		} else cb(err)
	})

}

function printCollection(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	c.find().toArray(function (err, arr) {
		if (!err) {
			console.log(str, arr)
			cb()
		} else cb(err)
	})
}

function readEach(c, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'

	var theDoc
	// we must in fact read to the end to make sure no duplicates
	c.find({id: 1}).each(function(err, doc) {
		if (!err) {
			if (!theDoc) {
				// it is the first callback - we should have the doc
				if (!doc) cb(Error('Record not found'))
				else {
					// the first returned document
					theDoc = doc
					console.log(str, doc)
					cb()
				}
			} else {
				// it is a subsequent callback - there should be no item
				if (doc) throw Error('multiple records')
			}
		} else cb(err)
	})
}

function drop(c, cb) {
	c.drop()
	c.find().count(function(err, num) {
		if (!err) {
			if (num != 0) cb(Error('Dropped collection not empty'))
			else cb()
		} else cb(err)
	})
}

function logValue(x, str) {
	// make sure str is string
	if (!str) str = ''

	// for array, print dimension and first element
	if (Array.isArray(x)) {
		str += ' array:' + x.length
		x = x[0]
	}

	var value
	if (x != null && typeof x == 'object') {
		// for object: print constructor name rather than all properties
		value = 'object:' + x.constructor.name
	} else {
		// for non-objects: lead-in with type, then value
		str += ' ' + typeof x
	 	value = x
	 }

	if (str.length) console.log(str, value)
	else console.log(value)
}	

// closeDb with error logging
function shutDown(err) {
	if (err) console.log('error:', err)
	closeDb(function (err) {
		if (err) console.log('close error:', err)
		console.log('end of program')
	})
}

// receive defaults, open the database
function init(defaultsx, cb) {
	defaults = defaultsx
	if (!db) {
		mongodb.connect(defaults.connectUrl, defaults.connectOpts, function (err, dbx) {
			if (!err) {
				db = dbx
				if (cb) cb()
			} else {
				if (cb) cb(err)
				else throw err
			}
		})
	} else if (cb) cb()
}

function closeDb(cb) {
	if (db) {
		var aDb = db
		db = undefined
		aDb.close(function(err) {
			if (cb) cb(err)
			else if(err) console.log('close error:', err)
		})
	} else if (cb) cb(null)
}
