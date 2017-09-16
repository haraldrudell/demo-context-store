// test-requestlogger.js
// © Harald Rudell 2012 MIT License

var requestlogger = require('../lib/requestlogger')

var matcher = require('../lib/matcher')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

dn = Date.now
mm = matcher.match

exports['LogRequest:'] = {
	'Exports': function () {
		assert.exportsTest(requestlogger, 1)
	},
	'GetRequestLogger': function () {
		var actual = requestlogger.getRequestLogger()
		assert.equal(typeof actual, 'function')
		assert.equal(Object.keys(actual), 0)
	},
	'LogRequest Next': function () {
		var expectedLog = {
			client: '0.0.0.0:0',
			ua: '?ua',
			time: '1970-01-01T00:00:00.007Z',
			duration: 0.002,
			statusCode: 0,
			url: 'http://0.0.0.0/url?',
		}

		var opts = {
			logger: mockLog,
		}
		var logRequest = requestlogger.getRequestLogger(opts)

		var aLog = []
		var eLog =[expectedLog]
		function mockLog(s) {aLog.push(JSON.parse(s))}

		var dateNow = 5
		Date.now = function mockDateNow() {return dateNow += 2}

		var aNext = 0
		function mockNext() {aNext++}

		logRequest({}, {}, mockNext)

		assert.ok(aNext)
		assert.deepEqual(aLog, eLog)
	},
	'LogRequest Headers': function () {
		var request = {headers: {}, url: '/URL'}
		request.headers['user-agent'] = 'USERAGENT'
		request.headers['x-forwarded-for'] = 'IP'
		request.headers['x-forwarded-port'] = 'PORT'
		request.headers['x-forwarded-proto'] = 'PROTO'
		request.headers.host = 'HOST'

		var res = {statusCode: 17}

		var expectedLog = {
			client: request.headers['x-forwarded-for'] + ':' + request.headers['x-forwarded-port'],
			ua: request.headers['user-agent'],
			time: '1970-01-01T00:00:00.007Z',
			duration: 0.002,
			statusCode: res.statusCode,
			url: request.headers['x-forwarded-proto'] + '://' + request.headers.host + request.url,
		}

		var opts = {
			logger: mockLog,
		}
		var logRequest = requestlogger.getRequestLogger(opts)

		var aLog = []
		var eLog =[expectedLog]
		function mockLog(s) {aLog.push(JSON.parse(s))}

		var dateNow = 5
		Date.now = function mockDateNow() {return dateNow += 2}

		logRequest(request, res, function mockNext() {})

		assert.deepEqual(aLog, eLog)
	},
	'Option LogIncoming Https IgnoreHeaders': function () {
		var request = {
			headers: {},
			connection: {
				socket: {
					server: {
						constructor: {
							name: 'HTTPSServer',
						},
					},
				},
			},
		}
		request.headers['x-forwarded-for'] = 'IP'

		var expectedLog = {
			client: '0.0.0.0:0',
			ua: '?ua',
			url: 'https://0.0.0.0/url?',
		}

		var aLog = []
		var eLog =[expectedLog]
		function mockLog(s) {aLog.push(JSON.parse(s))}

		var opts = {
			logIncoming: true,
			logger: mockLog,
			IgnoreHeaders: true,
		}
		var logRequest = requestlogger.getRequestLogger(opts)

		var dateNow = 5
		Date.now = function mockDateNow() {return dateNow += 2}

		var aNext = 0
		logRequest(request, {}, function mockNext() {aNext++})

		assert.ok(aNext)
		assert.equal(typeof (eLog[0].time = aLog[0] && aLog[0].time), 'string')
		assert.deepEqual(aLog, eLog)
	},
	'Option Matcher': function () {
		var matcherList = 5

		var isMatch = false
		var aMatch = 0
		matcher.match = function mockMatch(a) {assert.equal(a, matcherList); aMatch++; return isMatch}

		var logRequest = requestlogger.getRequestLogger({logger: mockLogger, matcherList: matcherList})

		var aLogs = 0
		function mockLogger(x) {aLogs++}

		logRequest({}, {}, function mockNext() {})
		assert.equal(aLogs, 0)
		assert.equal(aMatch, 1)

		isMatch = true
		logRequest({}, {}, function mockNext() {})
		assert.equal(aLogs, 1)
		assert.equal(aMatch, 2)
	},
	'after': function () {
		Date.now =dn
		matcher.match = mm
	}
}
