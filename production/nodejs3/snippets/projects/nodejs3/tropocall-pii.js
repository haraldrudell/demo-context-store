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
		numberToDial: '### 10-digit phone number here',
		msg: 'This is a test call using the Tropo api.',
		token: '### 88-character token here',
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
		http.get(urlm.format(urlObj), responseListener)
			.on('error', doEnd)
	} catch(e) {
		err = e
		process.nextTick(doEnd)
	}

	function responseListener(clientResponse) {
		statusCode = clientResponse.statusCode
		clientResponse
			.on('data', dataListener)
			.once('end', doEnd)
			.on('error', doEnd)
			.setEncoding('utf8')
	}

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
