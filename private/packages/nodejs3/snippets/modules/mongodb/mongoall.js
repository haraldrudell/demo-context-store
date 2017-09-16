// mongoall.js
// self-contained retrieve all records

// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/fs.html
var fs = require('fs')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var greatjson = require('greatjson')

var mongodb = require('mongodb')
var fs = require('fs')

var db
var collName = 'fb139381162852843'

readDb(result)

function result(err) {
	if (err) console.log(err)
}

function readDb(cb) {
	fs.readFile(path.join(process.env.HOME, 'apps', 'cloudclearing.json'), 'utf-8', readFileResult)

	function readFileResult(err, data) {
		if (!err) {
			var json = greatjson.parse(data)
			if (!(json instanceof Error)) {
				var dbUrl = json.dbview && json.dbview.dbUrl
				if (typeof dbUrl == 'string' && dbUrl) {
					mongodb.connect(dbUrl, connectResult)
				} else err = new Error('json file did not have dbview.dbUrl')
			} else err = json
		}
		if (err) cb(err)
	}

	function connectResult(err, dbx) {
		if (!err) {
			db = dbx
			db.collection(collName).find(findResult)
		} else cb(err)
	}

	function findResult(err, cursor) {
		if (!err) cursor.toArray(arrayResult)
		else close(err)
	}

	function arrayResult(err, arr) {
		if (!err) console.log(haraldutil.inspect(arr))
		else close(err)
	}

	function close(err) {
		if (db) {
			var dbx = db
			db = null
			dbx.close(closeResult)
		}

		function closeResult(err0) {
			if (err0 && !err) cb(err0)
			else cb(err)
		}
	}
}