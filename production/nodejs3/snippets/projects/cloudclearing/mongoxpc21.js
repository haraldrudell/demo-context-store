// mongoxpc21.js

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')
var db = {
	databaseName: 'c505cloud',
	username: 'c505',
	password: 'goodpass',
	host: 'xpc21',//ds031647.mongolab.com',
	port: 27017,//31647,
	dbOptions: {
		w:0,
	},
	serverOptions: {
	},
	authOptions: {
	},
}
require('haraldutil').p('newServer')
var server = new mongodb.Server(db.host, db.port, db.serverOptions)
require('haraldutil').p('newDb')
var db = new mongodb.Db(db.databaseName, server, db.dbOptions)
require('haraldutil').p('cb.Open')
db.open(openResult)

function openResult(err, self) {
require('haraldutil').p()
	if (!err) {
		if (db.username || db.password) self.authenticate(
			db.username,
			db.password,
			connectResult) // cb second argument self
		else connectResult()
	} else require('haraldutil').pp('open failed:', err)
}
function connectResult(err) {
require('haraldutil').p()
	if (!err) db.close(db, done)
	else require('haraldutil').pp('authentication failed:', err)
}
function done(err) {
require('haraldutil').p()
	if (err) require('haraldutil').pp('close failed:', err)
}
