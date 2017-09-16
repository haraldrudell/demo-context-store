// tropocall.js
// Place test calls using the Tropo api
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
1. Sign up at tropo.com
2. Create a Web api app
3. Insert the 88-character token below
4. Put in a phone number below
5. Request account verification, pay $10
*/

// http://nodejs.org/api/url.html
var urlm = require('url')
// http://nodejs.org/api/http.html
var http = require('https')

var urlObject = {
	protocol: 'https',
	host: 'api.tropo.com',
	pathname: '/1.0/sessions',
	query: {
		action: 'create',
		numberToDial: '4156830940',
		msg: 'This is a test call using the Tropo api.',
		token: '1d057d3e3da5154eb189b9a11e1d2789db66c72aaf162ee5cee3676a1ad62656934375f893e634b87c8a1992',
	},
}
var log = console.log

placeCall(urlObject, handleOutcome)

function handleOutcome(err, result) {
	if (!err) log('Success:', result)
	else log('Bad result:', err.stack || err.message || err, 'chars:', !!result && result.length, result)
}

function placeCall(urlObj, cb) {
	var statusCode
	var data
	var err
	var isEnd

	try {
		var x = http.get(urlm.format(urlObj), responseListener)
			.on('error', doEnd)
/*
		var ee = x.emit
		x.emit = function (e, d) {
			log(e, e !== 'socket' && e!== 'response' && d)
			var args = Array.prototype.slice.call(arguments)
			ee.apply(x, args)
		}
*/	} catch(e) {
		err = e
		process.nextTick(doEnd)
	}

	function responseListener(clientResponse) {
//require('haraldutil').p(clientResponse && clientResponse.statusCode)
		statusCode = clientResponse.statusCode
		clientResponse
			.on('data', dataListener)
			.once('end', doEnd)
			.on('error', doEnd)
			.setEncoding('utf8')
/*
		var x = clientResponse
		var ee = x.emit
		x.emit = function (e, d) {
			log('clevent', e, e !== 'socket' && e!== 'response' && d)
			var args = Array.prototype.slice.call(arguments)
			ee.apply(x, args)
		}
*/	}

	function dataListener(d) {
		if (!isEnd)
			if (data) data += d
			else data = d
	}

	function doEnd(e) {
		if (!isEnd) {
			isEnd = true
			if (e && !err) err = e
			if (!err)
				if (statusCode !== 200) err = new Error('Status code: ' + statusCode)
				else if (!data) err = new Error('Response missing: perhaps bad token')
			cb(err, data)
		}
	}
}
