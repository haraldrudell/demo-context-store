// mongofixture.js
// Open a db and propvide the name of an empty collection
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

var uuid = require('./uuid')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')
// http://nodejs.org/api/path.html
var path = require('path')

var defaultDb = {
	databaseName: 'test',
	collection: 'test',
	host: 'localhost',
	port: 27017,
	dbOptions: {
		w:0,
		pk: {createPk: uuid.uuid},
	},
	serverOptions: {
	},
	authOptions: {
	},
}

exports.getFixture = getFixture

/*
opts: object like defaultDb
.fns: list of functions if serail function execution
.log
cb(err, o) o: .db, .collection, .mongodb

if fns executes each fns with a dropped collection, then returns
otherwise provides and opened db with the collection dropped
*/
function getFixture(opts, cb) {
	var dbo = haraldutil.merge(defaultDb, opts)
	var result = {
		mongodb: mongodb,
		collection: dbo.collection,
		dropCollection: dropCollection,
		db: new mongodb.Db(dbo.databaseName,
			new mongodb.Server(dbo.host, dbo.port, dbo.serverOptions),
			dbo.dbOptions),
		printCollection: printCollection
	}
	var log = dbo.log || console.log

	result.db.open(openResult)

	function openResult(err, self) {
		if (!err)
			if (dbo.username || dbo.password) self.authenticate(dbo.username, dbo.password, getVersions)
			else getVersions()
		else cb(err)
	}

	function getVersions(err) {
		if (!err) getServerVersion(result.db, connectResult)
		else closeAndExit(err)
	}

	function connectResult(err, serverVersion) {
		if (!err) {
			if (!serverVersion) serverVersion = 'unknown'
			log('server:', serverVersion, 'driver:', getDriverVersion())
			if (Array.isArray(dbo.fns)) doFns()
			else result.dropCollections(checkDropResult)
		} else closeAndExit(err)
	}

	function cmd() {
		require('haraldutil').pargs(arguments)
	}

	function checkDropResult(err) {
		if (!err) cb(null, result) // good exit
		else closeAndExit(err)
	}

	function doFns() {
		var fns = dbo.fns.slice()
		doNextFn()

		function doNextFn(err) {
			if (!err) {
				var fn = fns.shift()
				if (fn) process.nextTick(getFnRunner(fn, doNextFn))
				else result.db.close(closeResult)
			} else closeAndExit(err)
		}

		function closeResult(err) {
			if (!err) log('\nExecuted functions:', dbo.fns.length)
			cb(err)
		}
	}

	function getFnRunner(fn, cb) {
		return doFn

		function doFn(fn) {
			result.dropCollection(invokeFn)
		}

		function invokeFn(err) {
			if (!err) {
				log('\nInvoking function:', fn.name)
				fn.call(result, result.db.collection(result.collection), checkLastError)
			} else cb(err)
		}

		function checkLastError(err) {
			if (!err) result.db.lastError(fnComplete)
			else cb(err)
		}

		// null, 1[{n: 0, connectionId: 123, err: null, ok: 1}]
		function fnComplete(err, result) {
			require('haraldutil').p(result)
			cb(err)
		}
	}

	function closeAndExit(err) {
		result.db.close(errorExit)

		function errorExit(e) {
			cb(err)
		}
	}

	function printCollection(cb) {
		var counter = 0
		result.db.collection(result.collection).find(printEach)

		function printEach(err, cursor) {
			if (!err) cursor.each(printOne)
			else cb(err)
		}

		function printOne(err, doc) {
			if (!err)
				if (doc) log(++counter, doc)
				else {
					if (!counter) log('empty collection')
					cb()
				}
			else cb(err)
		}
	}
}

// cb(err)
function dropCollection(cb) {
	var collection = this.collection
	var db = this.db

	db.collections(checkCollection)

	function checkCollection(err, collections) { // drop dbo.collection if it exists
		if (!err) {
			if (collections.some(findCollection)) db.dropCollection(collection, dropResult)
			else cb()
		} else cb(err)
	}

	function findCollection(collObject) { // true if macthing dbo.collection
		return collObject.collectionName === collection
	}

	function dropResult(err, bool) {
		if (!err) cb()
		else cb(err)
	}
}

function getDriverVersion() {
	var result = 'unknown'
	var filename = getMongoFilename()
	if (filename) {
		var packageJson = require(path.join(path.dirname(filename), '..', '..', 'package.json'))
		if (packageJson.version) result = packageJson.version
	}

	return result
}

function getMongoFilename() {
	var result
	scanModules(require.main)
	return result

	function scanModules(module) {
		if (module.exports === mongodb) result = String(module.filename)
		else module.children.some(scanModules)
		return result !== undefined
	}
}

function getServerVersion(db, cb) {
	db.command({buildInfo: 1}, result)

	function result(err, buildInfo) {
		cb(err, buildInfo && buildInfo.version || 'unknown')
	}
}
