// googlecall.js
// Place calls throuh Google Voice
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var voicejs = require('voice.js');

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')

var to = '18884039000'
var log = console.log
var duration = 1.5e4

var settings = require(path.join(haraldutil.getHomeFolder(), 'apps', 'nodejs3.json')).googlecall

var client = new voicejs.Client({
	email: settings.email,
	password: settings.password,
	tokens: require(path.join(haraldutil.getHomeFolder(), 'apps', 'tokens.json')),
})

client.connect({to: to, from: settings.from}, connectResult)

function connectResult(err, res, data) {
	if (!err) {
		log('calling...')
		setTimeout(cancelCall, duration)
		//client.connect({to: to, from: client.config.email}, leg2Result)
	} else log('Bad connect:', haraldutil.eToString(err))
}

function leg2Result(err, res, data){
	if (!err) {
		log('Calling forwarding Google Talk phone', client.config.email)
	} else log('Bad leg2:', haraldutil.eToString(err))
}

function cancelCall() {
	log('Terminating call after configured duration.')
	client.cancel(cancelResult)
}

function cancelResult(err, response, data) {
	if (!err) log('Call cancelled.')
	else log('Cancel failed:', haraldutil.eToString(err))
}
