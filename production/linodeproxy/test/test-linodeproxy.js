// test-linodeproxy.js
// © Harald Rudell 2013 MIT License
var linodeproxy = require('../lib/linodeproxy')

// https://github.com/haraldrudell/mochawrapper
var assert = require('mochawrapper')

exports['LinodeProxy:'] = {
	'Exports': function () {
		assert.exportsTest(linodeproxy, 1)
	},
	'InitApi DISABLED': function() {
	},
}