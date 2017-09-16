// nodejs3.js
// Share a port among node instances using name-based routing
// © Harald Rudell 2011 MIT License

require = require('apprunner').getRequire(require, exports, {
	api: require('apprunner').getAppData().appName, initApi: initApi,
	ready: false})

//var sky = require('sky')
//var scrapemanager = require('scrapemanager')
//var ontime = require('ontime')
var expressapi = require('expressapi')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')

function initApi(opts) {
	var appData = apprunner.getAppData({PORT: opts.port, URL: opts.url})

	// provision socket authentication
//	sky.setSecret(appData.views.facebook2.fb.fbAppSecret)
	// a scraper that runs at 1 am every morning
//	scrapemanager.init(opts.scrapemanager)
//	ontime.init(opts.ontime)

	expressapi.initApi()
}
