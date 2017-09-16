// monger.js
// maintain document lists in mongo database
var mongodb = require('mongodb')

// https://github.com/christkv/node-mongodb-native

exports.open = open
exports.close = close
// get array of ids
exports.getIds = getIds
exports.writeItem = writeItem
exports.deleteId = deleteId
// dump out the database
exports.logAll = logAll
exports.updateId = updateId
exports.getId = getId

var url = 'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing'
// key: collection, value: Db
var collections = {}
var db
var printfn = function() {}

// for the collection, verify that an item  id exists
// if it does not exist, write it to the database
//
// return value:
// true: item did exist
// false: item was created
// object: error result
function writeItem(collection, item, callback) {
	ensureCollection(collection, putItem, callback)

	function putItem(coll) {
//		coll.update(item, {safe:true}, callback)
		coll.insert(item, {safe:true}, callback)
	}
}

function updateId(collection, id, properties, callback) {
	ensureCollection(collection, updateIt, callback)

	function updateIt(coll) {
		coll.findAndModify({id: id}, [], properties, {safe:true}, callback)
	}
}

function getId(collection, id, callback) {
	ensureCollection(collection, getIt, callback)

	function getIt(coll) {
		coll.find({id: id}, function(err, cursor) {
			if (!err) {
				cursor.nextObject(function(err, doc) {
					callback(err, doc)
				})
			} else callback(err)
		})
	}
}

function deleteId(collection, id, callback) {
	ensureCollection(collection, deleteIt, callback)

	function deleteIt(coll) {
		// findAndModify (query, sort, doc, options, callback)
//		coll.findAndModify({id: id}, [], {safe:true, multi:true, remove:true}, callback)
		coll.findAndModify({id: id}, [], {}, {safe:true, multi:true, remove:true}, callback)
//		coll.findAndModify({}, [], {}, {safe:true, multi:true, remove:true}, callback)
	}
}


// collection: datasorce-userid 'fb-89'
// callback value: object key: ids, value: true
function getIds(collection, callback) {
	ensureCollection(collection, getFields, callback)

	function getFields(coll) {
		//console.log('getFields', coll.constructor.name)
		coll.find({ unfriended: { $exists: false}}, ['id'], function(err, cursor) {
			if (!err) 	{
				var result = {}
				cursor.each(function(err, doc) {
					if (!err) {
						if (doc) result[doc.id] = true
						else callback(null, result)
					} else callback(err)
				})
			} else callback(err)
		})
	}
}

function logAll(collection, callback, print) {
	ensureCollection(collection, getAll, callback)

	function getAll(coll) {
		//console.log('getFields', coll.constructor.name)
		coll.find(function(err, cursor) {
			if (!err) {
				print('db-start')
				cursor.each(function(err, doc) {
					if (!err) {
						if (doc) print(doc)
						else {
							print('db-end')
							callback()
						}
					} else callback(err)
				})
			} else callback(err, null)
		})
	}
}

function ensureCollection(collection, goodCallback, badCallback) {
	ensureDb(myCollection, badCallback)

	function myCollection() { // we have db
		var coll = collections[collection]
		if (coll) goodCallback(coll)
		else {
			db.collection(collection, function(err, collx) {
				if (!err) { // coll is a Collection
					coll = collx
					collections[collection] = coll
					goodCallback(coll)
	//				console.log('collection:', coll.collectionName, coll.constructor.name)
	//				coll.count(function(err, count) {
	//					if (!err) {
	//						console.log(count)
	//						callback(err, coll)
	//					} else callback(err, null)
	//				})
				} else badCallback(err, null)
			})
		}
	}

}

function open(callback, printfn) {
	ensureDb(done, callback)
	function done() {
		callback(null)
	}
}

function ensureDb(goodCallback, badCallback) {
	if (db) goodCallback()
	else {
		mongodb.connect(url, {}, function(err, dbx) {
			// dbx is authenticated database
			if (!err) {
				printfn('db.open')
				db = dbx
				goodCallback()
			} else badCallback(err, null)
		})
	}
}

function close() {
	if (db) {
		printfn('db.close') //, (new Error()).stack)
		db.close()
		db = undefined
	}
}
