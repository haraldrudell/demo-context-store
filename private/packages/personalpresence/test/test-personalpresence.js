// test-app.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var app

var apprunner = require('apprunner') // https://github.com/haraldrudell/apprunner
var haraldops = require('haraldops') // https://github.com/haraldrudell/haraldops

var assert = require('mochawrapper') // https://github.com/haraldrudell/mochawrapper

var hi = haraldops.init
var ia = apprunner.initApp

exports['Personal Presence:'] = {
	'Require': function () {
		var aInit = []
		var eInit = [{appName: 'Personal Presence'}]
		apprunner.initApp = function mockInitApp(o) {aInit.push(o)}

		haraldops.init = function mockInit(o) {return o}

		require('../app')

		assert.deepEqual(aInit, eInit)
	},
	'after': function () {
		haraldops.init = hi
		apprunner.initApp = ia
	},
}
