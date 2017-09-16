// checkhistory.js
// Exaine results of the LinkedIn history feature
// Copyright © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')

var mongofixture = require('../../modules/mongodb/mongofixture')

var fns = [checkDiana]
var log = console.log

var ccSettings = require(path.join(haraldutil.getHomeFolder(), 'apps', 'cloudclearing.json'))
	.api.apiMap.trackerapi
var app = ccSettings.apps[0]
var collectionName = [
	'h' + app.consumer.service,
	app.consumer.id,
	app.access.userId,
	].join('-')

var dbo = haraldutil.merge(ccSettings.db)
delete dbo.collection // mongofixture drops the collection: let it drop the test collection

mongofixture.getFixture(haraldutil.merge(dbo, {fns: fns}), done)

function checkDiana(collection, cb) {
	var db = collection.db
	var collection = db.collection(collectionName)
log(db.databaseName, collection.collectionName)
//	collection.find({})

	collection.find({id: '471830'}, getArray)

	function getArray(err, cursor) {
		if (!err) cursor.toArray(printArray)
		else cb(err)
	}

	function printArray(err, arr) {
		if (!err) {
			log(arr[0].positions)
			log(arr[1].positions)
			cb()
		} else cb(err)
	}
}

function done(err) {
	if (err) throw err
}
