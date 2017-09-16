// mongocollections.js
// examine how to find mongo collections

/*
Reference for:
db.collection
db.collectionNames
db.collections
db.collectionsInfo
db.createCollection
db.dropCollection
db.renameCollection

Collection {
 db: Db object {...}
 collectionName: 'test',
  internalHint: null,
  opts: {},
  slaveOk: false,
  serializeFunctions: false,
  raw: false,
  pkFactory()
}
aggregate
count
createIndex
distinct
drop
dropAllIndexes
dropIndex
dropIndexes
ensureIndex
find
findAndModify
findAndRemove
findOne
geoHaystackSearch
geoNear
group
hint
indexExists
indexInformation
indexes
insert
isCapped
mapReduce
reIndex
remove
rename
save
stats
update
*/

var defaults = {
	collection: 'test',
	funcs: [
		dbCollections,
		dbCollectionNames,
		dbCollection,
		dropCollection,
	],
}

var dbo = require('./mongohelper').get(defaults)
dbo.start()

function dbCollections(cb) {
	var func = arguments.callee.name

	// db.collections must have a callback and give us exactly ONE callback
	// second argument is Array of Collection
	dbo.db.collections(function(err, collections) {
		//console.log(collections[4])
		if (!err) {
			if (!Array.isArray(collections)) throw('got non-Array')

			console.log(func, 'Number of collections in the database:' + collections.length)
			var s = []
			collections.forEach(function (collection) {
				s.push(collection.collectionName)
			})
			console.log(func, s.join(', '))
			cb()
		} else cb(err)
	})
}

/* collectionNames does not return the plain names:
[ { name: 'harald.system.users' },
  { name: 'harald.system.indexes' },
  { name: 'harald.objectlabs-system',
    options: { create: 'objectlabs-system' } },
  { name: 'harald.jobs' } ]
*/
function dbCollectionNames(cb) {
	var func = arguments.callee.name

	// db.collectionNames must have a callback and give us exactly ONE callback
	// second argument is Array of object:Object each which has at least a property name
	dbo.db.collectionNames(function(err, collections) {
		if (!err) {
			if (!Array.isArray(collections)) throw('got non-Array')

			console.log(func, 'Number of collections in the database:' + collections.length)
			console.log(func, dbo.getValue(collections[0]))
			// { name: 'harald.test' }
			//console.log(collections[4])
			var s = []
			collections.forEach(function (collection) {
				s.push(collection.name)
			})
			console.log(func, s.join(', '))
			cb()
		} else cb(err)
	})
}

// collection returns a collection even if it does not exist
/* Fetch a specific collection (containing the actual collection information)
 * 
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a getLastError command returning the results of the command on MongoDB.
 *  - **slaveOk** {Boolean, default:false}, Allow reads from secondaries.
 *  - **serializeFunctions** {Boolean, default:false}, serialize functions on the document.
 *  - **raw** {Boolean, default:false}, perform all operations using raw bson objects.
 *  - **pkFactory** {Object}, object overriding the basic ObjectID primary key generation.
 *
 * @param {String} collectionName the collection name we wish to access.
 * @param {Object} [options] returns option results.
 * @param {Function} [callback] returns the results.
 * @return {null}
 * @api public
 */
//Db.prototype.collection = function(collectionName, options, callback) {
function dbCollection(cb) {
	var func = arguments.callee.name

	// db.collection can have a callback and give us exactly ONE callback
	// second argument is Collection
	// for a new collection, lazy-creates
	dbo.db.collection(defaults.collection, function(err, collection) {
		if (!err) {
			console.log(func, dbo.getValue(collection))
			cb()
		} else cb(err)
	})
}

/**
 * Drop a collection from the database, removing it permanently. New accesses will create a new collection.
 * 
 * @param {String} collectionName the name of the collection we wish to drop.
 * @param {Function} callback returns the results.
 * @return {null}
 * @api public
 */
 //Db.prototype.dropCollection = function(collectionName, callback) {
// callback is optional, but the drop is executed using callback
// without callback an error will not be discovered
// because db.collection does not create the collection until the first record is saved
// dropCollection may fail with err: MongoError: ns not found
// therefore, use collectionNames to see if the collection actually exists
// issue is that names are garbled, like: { name: 'harald.test' } when 'test' was expected
// instead use collections
function dropCollection(cb) {
	var func = arguments.callee.name

	// create collection
	//dbo.db.collection(defaults.collection)
	//console.log(func, 'db.collection complete')

	// check if the collection exists
	dbo.db.collectionNames(function(err, collections) {
		if (!err) {
			var exists = collections.indexOf(defaults.collection) != -1

			if (exists) {
				console.log(func, 'deleting:', defaults.collection)
				// the collection does exists drop
				drop()
			} else {
				console.log(func, defaults.collection, 'did not exist')
				cb()
			}
		} else dbo.errCb(err, cb)
	})

	function drop(cb1) {
		if (!cb1) cb1 = cb
		dbo.db.dropCollection(defaults.collection, function (err, bool) {
			if (!err) {
				console.log(func, dbo.getValue(bool))
				cb1()
			} else dbo.errCb(err, cb)
		})
	}
}