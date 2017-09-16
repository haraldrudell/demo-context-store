// mongotest.js: test mongo connectivity

var haraldutil = require('haraldutil')

var mongodb = require('mongodb')

// my mongolabs database:
// mongodb://<user>:<password>@ds031647.mongolab.com:31647/cloudclearing
var MONGO_HOST = 'ds031647.mongolab.com'
var MONGO_PORT = 31647
var MONGO_DATABASE = 'cloudclearing'
var MONGO_DB_USERNAME = 'headless'
var MONGO_DB_PASSWORD = 'qweasd'
// why can I connect without user and password?
// how do I verify that my database does exist?
// how do I list collections?

// conclusions:
// if db url is incorrect, that is discovered in db.open callback
conclusions()
//using_connect()
//mongo_research()
function conclusions() {
	var db = new mongodb.Db(
		MONGO_DATABASE,
		new mongodb.Server(
			MONGO_HOST,
			MONGO_PORT,
			{auto_reconnect: true}),
		{})
	db.open(function(err, db) {
		if (!err) {
			db.authenticate(MONGO_DB_USERNAME, MONGO_DB_PASSWORD, function(errorObject, result) {
				if (!errorObject) { // authenticated ok
					db.collectionNames(function(err, doc) {
						if (!err) {
							console.log('success!')
							console.log(doc)
						} else { // err is string
							haraldutil.logError(err, 'Listing collection names failed')
						}
						closeDb()
					})
				} else {
					haraldutil.logError(errorObject, 'Authentication failed')
					closeDb()
				}
			})
		} else {
			haraldutil.logError(err, 'Opening database failed before authorization')
			closeDb()
		}

		// close db
		function closeDb() {
			db.serverConfig.close(function() {
				console.log('closed')
			})		
		}
	})
}

function using_connect() {
	var url = 'mongodb://' + MONGO_DB_USERNAME + ':' +
		MONGO_DB_PASSWORD + '@' +
		MONGO_HOST + ':' +
		MONGO_PORT + '/' +
		MONGO_DATABASE
	var options = {auto_reconnect: true}

	// internally does new Server(), new Db(), db.open(), db.authenticate()
	mongodb.connect(url, options, function(err, conn) {
		if (!err) {
			console.log('Successfully authenticated with database:', conn.databaseName)
		} else {
			haraldutil.logError(err, 'Connect with mongo database failed')
		}
		conn.close()
	})
}

// by reverse engineering mongodb module
// no communication before db.open
// if you do not do server.close, node will not exit
function mongo_research() {
	var Server = mongodb.Server
	var Db = mongodb.Db

	// runtime parameters
	var server
	var db

	console.log(haraldutil.getLocation(), 'connectServer')
	connectServer()
	// server.isConnected() is still false

	console.log(haraldutil.getLocation(), 'openDb')
	openDb()
	console.log(haraldutil.getLocation(), 'isConnected:', server.isConnected())

	db.open(function(err, db) {
		console.log(haraldutil.getLocation(), 'db.open callback')
		if (db) {
			console.log(db)
			console.log(haraldutil.getLocation(), 'isConnected3:', server.isConnected())
			server.dbInstances.forEach(function(dbInstance) {
			console.log(dbInstance.databaseName)
			})
		}
		if (err) {
			console.log(haraldutil.getLocation(), 'found error')
			haraldutil.logError(err)
		}
		console.log(haraldutil.getLocation(), 'closeServer')
		closeServer()
	})

	function connectServer() {
		var host = 'zds031647.mongolab.com'
		var port = 31647
		// poolSize, ssl, slave_ok, readPreference, socketOptions, logger
		// auto_reconnect, eventReceiver
		var options = {auto_reconnect: true}
		server = new Server(host, port, options)
	}

	function openDb() {
		var databaseName = 'test'
		var serverConfig = server
		// override_used_flag, strict, pk, logger, serializeFunctions, raw
		// recordQueryStats, reaper, retryMiliSeconds, numberOfRetries
		// reaperInterval, reaperTimeout
		var options = {}

		db = new Db(databaseName, serverConfig, options)
	}

	function closeServer() {
		server.close(function() {
			console.log(haraldutil.getLocation(), 'isConnected2:', server.isConnected())
		})
	}	
	console.log(haraldutil.getLocation(), 'run complete')

}

// 120401 test bug in haraldutil.getLocation
function testLocation() {
	console.log('testLocation')
	var offset = 0
	var e = new Error()
	var frames = e.stack.split('\n')
	var line = frames[2 + offset]
	//     at /home/foxyboy/Desktop/c505/node/cloudclearing/mongoresearch/mongotest.js:30:3
	console.log(line)
	var file = line.lastIndexOf('/')
	var lastcolon = line.lastIndexOf(')')
	console.log('file:', file, 'lastcolon', lastcolon, line.substring(file + 1, lastcolon))
	console.log('testLocation complete')
}
