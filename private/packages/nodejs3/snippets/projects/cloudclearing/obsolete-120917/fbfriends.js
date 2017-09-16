// fbfriends.js
// api that reads fbfriends to database every 24 hours
// © Harald Rudell 2012

/*
maintain a Facebook user's friends list
implemented as an api so it can be invoked from anywhere
configured by fb app
*/

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var emitter = new (require('events').EventEmitter)
var apiName = emitter.id = 'FB Friends'

var friends_fields = [
	'about_me',
	'activities',
	'birthday',
	'checkins',
	'education_history',
	'events',
	'groups',
	'hometown',
	'interests',
	'likes',
	'location',
	'notes',
	'photos',
	'questions',
	'relationships',
	'relationship_details',
	'religion_politics',
	'status',
	'subscriptions',
	'videos',
	'website',
	'work_history',
]

exports.initApi = initApi

var instanceMap = {}

var scheduler
var apprunner
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
	var fbOpts = opts.config
	var key = createKey(opts.config.fbAppId, opts.config.fbId)
	var instance = instanceMap[key]
	if (!instance) {
		instanceMap[key] = instance = {}

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

		runPeriodic()
	}

	// do our action
	function runPeriodic() {
		// find all users that have the feature enabled
		// for now only the opts specified
		var users = [fbOpts.fbId]

		// when we run this
		var now = Date.now()

		doUsers() // do sequentially for now

		function doUsers() {
			var userId = users.pop()
			if (userId) {
				// get a Facebook api for the user
				var fb = apprunner.getApi({api: 'fb',
					fbAppId: fbOpts.fbAppId,
					fbId: userId,
				})
				fb.apiReady(doActions)
			}
		}

		function doActions(err) {
			if (!err) {
				// get the current friends list
				fb.graphGet('/me/friends?fields=' + friends_fields.join(','),
					friendsResult)
			} // err already reported
		}

		function friendsResult(err, data) {
			if (!err) {
				// now parse each one and match against database
				console.log(data[0])
			} // err already reported
		}
		function prevResult(err, data) {
			if (!err) prev = data
			else console.log('prev BAD')
			done()
		}

		function done() {
			if (cbc.isDone(arguments.callee)) {
				var nowMap = {}
				now.forEach(function (o) {
					nowMap[o.id] = o
				})
				var prevMap = {}
				prev.forEach(function (o) {
					prevMap[o.id] = o
				})
				for (var id in nowMap) {
					if (!prevMap[id]) log('new', nowMap[id])
				}
				for (var id in prevMap) {
					if (!nowMap[id]) log('prev', prevMap[id])
				}
			}
		}
		function log(head, o) {
			console.log(head, o.first_name, o.last_name, o.id)
		}
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