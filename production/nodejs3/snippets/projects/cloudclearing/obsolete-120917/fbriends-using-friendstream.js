// fbfriends.js
// api that reads fbfriends to database every 24 hours
// © Harald Rudell 2012

var friendstream = require('./friendstream')
var instrument = require('./instrument')

/*
maintain a Facebook user's friends list
implemented as an api so it can be invoked from anywhere
configured by fb app
*/

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var emitter = new (require('events').EventEmitter)
var apiName = emitter.id = 'FB Friends'

exports.initApi = initApi

var instanceMap = {}

var scheduler
var apprunner
var fbOpts
/*
access token information:
config.fbAppId
config.fbId
*/
function initApi(opts) {
	if (!scheduler) {
		scheduler = opts.apprunner.getApi({api: 'scheduler'})
		apprunner = opts.apprunner
	}
	fbOpts = opts.config
	var key = createKey(opts.config.fbAppId, opts.config.fbId)
	var instance = instanceMap[key]
	if (!instance) {
		instanceMap[key] = instance = {}
		process.nextTick(function () {
			doActions()
		})

		instance.result = {
			endApi: endApi,
			emitter: emitter,
			initApi: initApi
		}
	}

	return instance.result

	// both schedule and run immediately
	function doActions() {
		// schedule daily at midnight
		instance.schedule = scheduler.getScheduler({}, runPeriodic)
		console.log(emitter.id, 'scheduled')

		runPeriodic()
	}

	// do our action
	function runPeriodic() {
		// find all users that have the feature enabled
		// for now only the opts specified
		var users = [fbOpts.fbId]
		// when we run this
		var now = Date.now()
		console.log(emitter.id, users.length, new Date(now))

		doEachUser() // do sequentially for now

		function doEachUser(err) {
			var userId = users.pop()
			if (userId) {
				processUser(userId, doEachUser)
			} else console.log(emitter.id, 'complete', (Date.now() - now) / 1e3)

		}
	}
}

function processUser(userId, cb) {
	var hadError
	// get a Facebook api for the user
	var fb = apprunner.getApi({api: 'fb',
		fbAppId: fbOpts.fbAppId,
		fbId: userId,
	})
	var x = new friendstream.FriendStream(fb)
	x.on('data', processFriend)
	instrument.instrument(x)
	apprunner.addErrorListener(x)
	x.on('error', markError)
	x.on('end', processDb)

	function processFriend(data) {
		console.log(data.id)
	}
	function processDb() {
		if (hadError) ;
	}
	function markError() {
		hadError = true
	}
}

function endApi(cb) {
	for (var i in instanceMap) {
		instance = instanceMap[i]
		if (instance.schedule) {
			instance.schedule.cancel()
			instance.schedule = null
		}
	}
	cb()
}

// obsolete
function getPreviousList(dbOpts, cb) {
	var opts = haraldutil.merge(dbOpts, {
		api: 'mongo',
		callback: mongoReady})
	var mongo = apprunner.getApi(opts)

	function mongoReady(err) {
		if (!err) mongo.find({},
			{fields: {id: 1, first_name: 1, last_name: 1}},
			findResult)
		else cb(err)
	}

	function findResult(err, cursor) {
		if (!err) cursor.toArray(extractIds)
		else cb(err)
	}

	function extractIds(err, arr) {
		var result = []
		if (!err) arr.forEach(function (el) {
			result.push(el)
		})
		cb(err, result)
	}
}

function createKey() {
	var result = ''

	// true if false was never returned
	if (!Array.prototype.slice.call(arguments).every(function (value) {
		var ok = value && typeof value.valueOf() == 'string'
		if (ok) result += '(' + value + ')'
		return ok
	})) result = null

	return result
}