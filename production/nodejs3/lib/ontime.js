// ontime.js
// Notice time-sensitive events
// © Harald Rudell 2012 MIT License

// TODO replace this with perioder

var applego = require('applego')
// https://github.com/mikeal/request
var request = require('request')
// http://nodejs.org/api/path.html
var path = require('path')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')

exports.init = init
exports.getState = getState

var marker = path.basename(__filename, path.extname(__filename))
var types = { // key: string name of scrape type from json settings, value: instantiator function
	eventbrite: getEventbrite,
	meetup: getMeetup,
}
var time5s = 5e3
var timeToFirstRun = time5s

var onTime
var log

function init(opts) {
	if (!opts) opts = {}
	log = opts.log || console.log
	if (typeof opts === 'object' && Object.keys(opts).length) {
		onTime = new OnTime(opts, types)
		setTimeout(onTime.invokeAll, timeToFirstRun)
	}
}

function getState() {
	return onTime ? onTime.state() : []
}

function OnTime(ontimes, types) {
	this.count = count
	this.invokeAll = invokeAll
	this.state = state
	var sendMail = apprunner.getAppData().sendMail
	var timerList = []

	for (var ontime in ontimes) {
		var config = ontimes[ontime]
		var instantiator = config && types[config.type]
		if (instantiator) {
			var timer = {
				name: ontime,
				url: config.url,
				period: config.schedule && config.schedule.period || 'daily',
				count: 0,
				sendMail: sendMail,
			}
			timer.timerFn = instantiator(timer)
			timer.scheduler = applego.scheduler.getScheduler(config.schedule, timer.timerFn)
			timerList.push(timer)
		} else throw Error(['Bad ontime type for:', ontime].join(' '))
	}

	function count() {
		return timerList.length
	}

	function invokeAll() {
		timerList.forEach(invokeTimerFn)
	}

	function invokeTimerFn(timer) {
		timer.timerFn()
	}

	function state() {
		var result = []
		timerList.forEach(saveTimer)
		return result

		function saveTimer(timer) {
			result.push({
				name: timer.name,
				first: timer.first,
				last: timer.last,
				count: timer.count,
				period: timer.period
			})
		}
	}
}

function getEventbrite(item) {
	return function eventbrite() {
		item.last = new Date
		if (item.count++ == 0) {
			item.first = item.last
			log(slogan, 'first invocation:', item.name)
		}

		request(item.url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
//				var available = body.indexOf('Sold Out') == -1
//require('fs').writeFileSync('/tmp/nexus10.txt', body)
				var available = !~body.indexOf('>Coming Soon<')
				if (available) item.sendMail({subject: item.name, body: 'Available!'})
			} else {
				if (!error) error = Error('Status code:' + response.statusCode)
				var o = {
					location: new Error(arguments.callee.name),
					item: item,
				}
				applego.anomaly(error, o)
			}
		})
	}
}

function getMeetup(item) {
	var searchKey = 'No spots left'

	return function meetup() {
		item.last = Date.now()
		if (!item.count++) {
			item.first = item.last
			log(marker, 'first invocation:', item.name)
		}

		request(item.url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var pos = body.indexOf(pos)
				if (~body.indexOf(pos + 1)) log(marker, 'Warning: search multiple')
				var available = !~pos

				if (available) item.sendMail({subject: item.name, body: 'Available!'})
else require('haraldutil').p(new Date().toISOString(), 'no')
			} else {
				if (!error) error = Error('Status code:' + response.statusCode)
				var o = {
					location: new Error(arguments.callee.name),
					item: item,
				}
				applego.anomaly(error, o)
			}
		})
	}
}
