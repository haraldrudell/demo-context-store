// linkedinget.js
// Which api and user id should I use for most information?
// Copyright © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

/*
1. Using connections api, you can read all your first degree connections
- you can not read a specific one
- works for getting your current connections, which you cna also get from your own profile

2. The people api works with apiId
*/

var lilinkfields = require('./lilinkfields')
jsutil = require('../../../javascript/jsutil.js')
// https://github.com/ciaranj/node-oauth
var oauth = require('oauth')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/http.html
var http = require('http')
// http://nodejs.org/api/util.html
var util = require('util')

var log = console.log
p = jsutil.p
p(path.basename(__filename))
var apiId = '07BE8S9g-r'
var siteId = '28763432'
var headers = {
	'x-li-format': 'json',
	Accept : '*/*',
	Connection: 'close',
}

var testMap = {
	'People, unknown user:': {
		url: 'http://api.linkedin.com/v1/people/0',
	},
	'People/siteId:': {
		url: 'http://api.linkedin.com/v1/people/id=' + siteId,
	},
	'People/apiId:': {
		url: 'http://api.linkedin.com/v1/people/id=' + apiId,
	},
	'Connections:': {
		url: 'http://api.linkedin.com/v1/people/~/connections',
	}
}

// get OAuth data
if (true) {
	opts = require(path.join(haraldutil.getHomeFolder(), 'apps', 'cloudclearing.json'))
		.api.apiMap.trackerapi.apps[0]
}
verifyOpts(opts)
oauthConsumer = new oauth.OAuth(null, null,
	opts.consumer.key, opts.consumer.secret,
	'1.0', null, 'HMAC-SHA1',
	null, headers)



run(CompareApis, checkFields, benchMarkRequests)



/*
1.   What api should I use to read profiles?
1a.  People api, unknown user:Error from server: Invalid member id {0} status code: 404
1b.  People api, siteId:Error from server: Invalid member id {28763432} status code: 404
1c.  People api, apiId:4
1d.  Connections api:9
1e.  Conclusion: people using apiId or connections
*/
function CompareApis(cb) {
	p('What api should I use to read profiles?', true)
	var tests = Object.keys(testMap)
	next()

	function next() {
		var testName = tests.shift()
		var test
		if (testName) oauthConsumer.get((test = testMap[testName]).url, opts.access.token, opts.access.secret, result)
		else {
			p('Conclusion: people/apiId or connections')
			cb()
		}

		function result(err, body, response) {
			var fields
			if (!err) {
				var object = JSON.parse(body)
				if (Array.isArray(object.values)) {
					var profile
					object.values.some(findProfile)
					var fields = profile ? Object.keys(profile).length : 0
					function findProfile(aProfile) {
						var result = aProfile.id === apiId
						if (result) profile = aProfile
						return result
					}
				} else fields = Object.keys(object).length
			}
			/*
			People api, unknown user: Error from server: Invalid member id {0} status code: 404
			People api, siteId: Error from server: Invalid member id {28763432} status code: 404
			People api, apiId: 4
			Connections api: 9
			*/
			pArgs = [testName]
			if (fields) pArgs.push('defFields:', fields)
			if (err) pArgs.push(makeError(err).message)
			p(pArgs.join(' '))
			next()
		}
	}

	/*
	connections request
{
  values: 1521[{
      pictureUrl: 'http://m3.licdn.com/mpr/mprx/0_-HOmp-jVRA3-5C8it70jpl25c-Nt53AiKEoAplgLHN8Cs56_YaaCtAdIJ0qS66rf1IpK19f8jVma',
      firstName: 'Hanna',
      apiStandardProfileRequest: {
        headers: {
          values: 1[{
              name: 'x-li-auth-token',
              value: 'name:-MKC'
            }, (nonE)length: 1],
          _total: 1
        },
        url: 'http://api.linkedin.com/v1/people/07BE8S9g-r'
      },
      location: {
        name: 'Kristiansand Area, Norway',
        country: {
          code: 'no'
        }
      },
      siteStandardProfileRequest: {
        url: 'http://www.linkedin.com/profile/view?id=28763432&authType=name&authToken=-MKC&trk=api*a177132*s185320*'
      },
      lastName: 'Aase',
      headline: 'Founder - www.hannaaase.com',
      industry: 'Online Media',
      id: '07BE8S9g-r'
    }	*/
	/*
	people api and apiId
	{ firstName: 'Hanna',
		headline: 'Founder - www.hannaaase.com',
		lastName: 'Aase',
		siteStandardProfileRequest: {
			url: 'http://www.linkedin.com/profile/view?id=28763432&authType=name&authToken=-MKC&trk=api*a177132*s185320*'
		}
	}
	/*
	Error
	with json header
	{
  "errorCode": 0,
  "message": "Invalid member id {0}",
  "requestId": "387FZOHKU3",
  "status": 404,
  "timestamp": 1361006879769
}

	{
		statusCode: 404,
  		data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n
  			<error>\n
  			<status>404</status>\n
  			<timestamp>1361000488701</timestamp>\n
  			<request-id>CD0B0FNAJ4</request-id>\n
  			<error-code>0</error-code>\n
  			<message>Invalid member id {0}</message>\n
  		</error>\n' }
	*/
/*
	protocol: 'http',
	host: 'api.linkedin.com',
	pathname: '/v1/people/~/connections:(id,site-standard-profile-request)',
*/
}



/*
2.   Which of people/apiId or connections provides the most fields?
bad: Error: Error from server: Members may only view their own company recommendations. status code: 403 suggestions noJson
bad: Error: Error from server: Can't access other member's network updates within scope=network status code: 403 network noJson
2a.  people54/56
2b.  connections56/56
2c.  Any, but with people specific profiles can be requested
*/
function checkFields(cb) {
	p('Which of people/apiId or connections provides the most fields?', true)

	var cbCounter = 2
	var fields = lilinkfields.fields()
	loopFields('connections',
		'http://api.linkedin.com/v1/people/~/connections:(%s)?count=1',
		fields, end)
	loopFields('people',
		'http://api.linkedin.com/v1/people/id=' + apiId + ':(%s)',
		fields, end)

	function end(err, result) {
		p(result.slogan +  result.fields.length + '/' + fields.length)
		if (!--cbCounter) {
			p('Any, but consider that with people specific profiles can be requested')
			cb()
		}
	}
}

function loopFields(slogan, urlFormat, fields, cb) {
	var fields = fields.slice()
	var cbCounter = fields.length
	var result = {
		slogan: slogan,
		fields: [],
		failures: 0,
	}

	nextField()

	function nextField() {
		var field = fields.shift()
		if (field) {
			var url = util.format(urlFormat, field)
			oauthConsumer.get(url, opts.access.token, opts.access.secret, reply)
		}

		function reply(err, data) {
			var ok
			if (!err) {
				var object
				try {
					object = JSON.parse(data)
				} catch(e) {}
				var o = object
				if (object) { // body was json
					if (object.values) object = object.values[0] // people reply is a single-element array
					ok = true // json means ok (the data field might be empty)
					//Object.keys(object).length > 0
					if (ok) result.fields.push(field)
					//if (ok) log(field + ':', Object.keys(object))
				}
			}
			if (err) {
				log('bad:', makeError(err).toString(), field, o || 'noJson')
			}
			if (!err && !ok) throw new Error('fixThis')
			if (--cbCounter) nextField()
			else cb(null, result)
		}
	}
}



/*
3.   What is the fastest to connections total: all ids, single id, 500 profiles?
3a.  One id: 0.168 s total:
3b.  All ids: 1.487 s total:
3c.  500 first: 10.118 s total:
*/
function benchMarkRequests(cb) {

	p('What is the fastest to connections total: all ids, single id, 500 profiles?', true)

	var fields = lilinkfields.fields()
	delete fields['network']
	delete fields['suggestions']

	var requests = {
		'All ids': 'http://api.linkedin.com/v1/people/~/connections:(id,site-standard-profile-request)',
		'One id': 'http://api.linkedin.com/v1/people/~/connections:(id)?count=1',
		'500 first': 'http://api.linkedin.com/v1/people/~/connections:(' + fields.join(',') + ')?count=500',
	}
	var cbCounter = 1 + Object.keys(requests).length
	for (var request in requests) timeRequest(requests[request], request, printResult)
	printResult()

	function timeRequest(url, slogan, cb) {
		cbCounter++
		var t = Date.now()
		oauthConsumer.get(url, opts.access.token, opts.access.secret, answer)

		function answer(err, result) {
			var total
			if (typeof result === 'string') {
				var object
				try {
					object = JSON.parse(result)
				} catch (e) {}
				if (object) total = result._total
			}

			var result = [slogan + ':', (Date.now() - t) / 1e3, 's', 'total:', total]
			if (err) result.push(err.message)
			cb(result.join(' '))
		}
	}

	function printResult(message) {
		if (message) p(message)
		if (!--cbCounter) cb();
	}
}



// utility functions
function makeError(e, invocation) { // ensure instanceof Error
	if (!(e instanceof Error)) {
		var e0
		var message = ['Error from server:']
		if (typeof e === 'object') { // interpret the object and its properties into instanceof Error
			e0 = e
			if (typeof e.data === 'string') { // add string or json to error message
				var eDataObject
				try { // '{"errors":[{"message":"Bad Authentication data","code":215}]}'
					eDataObject = JSON.parse(e.data)
				} catch (e) {
					message.push('string:', haraldutil.inspect(e.data).substring(0, 100))
				}
				if (eDataObject) {
					var didWrite
					for (var p in eDataObject)
						if (p === 'status') {
							if (!e0.statusCode) didWrite = message.push('status code:', eDataObject.status)
						} else if (p !== 'requestId' &&
							p !== 'timestamp') didWrite = message.push(p + ':', eDataObject.message)
					if (!didWrite) message.push('json:', haraldutil.inspect(eDataObject, {singleLine: true, dateISO: true, errorPretty: true}).substring(0, 100))
				}
			}
			if (e0.statusCode) message.push('status code:', e0.statusCode)
		} else // interpret primitive as error
			message.push('type: ', typeof e, 'value:', String(e).substring(0, 100) || 'empty ')
		e = new Error(message.join(' '))
		for (var p in e0) e[p] = e0[p]

	}
	if (invocation) e.invocation = invocation
	return e
}

/* xml error crap
function makeError(e, invocation, cb) { // ensure instanceof Error
	var message
	var e0 = e

	if (!(e instanceof Error)) {
		message = ['Service error:']
		if (typeof e === 'object') { // interpret the e object into instanceof Error
			if (typeof e.data === 'string') { // add string or json to error message
require('haraldutil').p(e.data)
				xml2js.parseString(e.data, copyProperties)
					.on('error', function () {})
			} else {
				message.push(haraldutil.inspect(e, {singleLine: true, dateISO: true, errorPretty: true}).substring(0, 100))
				copyProperties(true)
			}
		} else { // interpret primitive value
			message.push('type: ', typeof e, 'value:' , String(e).substring(0, 100) || 'empty ')
			end()
		}
	} else end()

	function copyProperties(err, result) {
		if (!err) { // interpret xml
require('haraldutil').p(result)
		}
		if (e0.statusCode) message.push('status code:', e0.statusCode)
		e = new Error(message.join(' '))
		for (var p in e0) e[p] = e0[p]
		end()
	}

	function end() {
		if (invocation) e.invocation = invocation
		cb(e)
	}
}
*/

function verifyOpts(opts) {
	var requiredOptions = {
		consumer: ['key', 'secret', 'callback'],
		access: ['token', 'secret', 'userId'],
	}
	var o
	for (var property in requiredOptions) {
		o = opts && opts[property] || {}
		requiredOptions[property].forEach(verifyString)

		function verifyString(key) {
			var value = o[key]
			if (typeof value !== 'string' || !value)
				throw new Error(['Options.', property, '.', key, ' is not a non-empty string'].join(''))
		}
	}
}

// argument list is functions
function run() {
	var fns = Array.prototype.slice.call(arguments).concat(end)
	runNextFn()

	function runNextFn() {
		var fn = fns.shift()
		if (typeof fn === 'function') {
			fn(runNextFn)
		}
	}

	function end() {
	}
}
