// ops.js
// Render api state
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// TODO 130211 nodejs3 uses both ejs and html, so we must add .html to view name
// It's ugly, should it be fixd somehow?

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// http://nodejs.org/api/os.html
var os = require('os')

exports.getHandler = handleOps

function handleOps(opts, view) {
	opts = opts && opts.view && opts.view[view] || {} // 130220 webfiller should provide options for the view rather than global properties
	var appData = apprunner.getAppData()
	var whitelist = Array.isArray(opts.whitelist) && opts.whitelist || []
	return renderOps

	function renderOps(request, response, next) {
		if (!gate()) next()
		else {

			var now = Date.now()
			var nowDate = new Date(now)

			var opts = {
				title: view.substring(0, 1).toUpperCase() + view.substring(1) + ' ' + appData.appName,
				bindings: exports.fragments.ops,
				layout: false, // nodejs3: do not render partials wrapper
				json: haraldutil.inspectAll(apprunner.getApiStates()),
				now: nowDate.toISOString(),
				nowPt: haraldutil.getISOPacific(nowDate),
				host: os.hostname(),
				app: appData.appName,
				pid: process.pid,
			}
			response.render(view + '.html', opts) // nodejs3: clarify html and not ejs
		}

		function gate() { // true: user is on whitelist
			var result
			var userId

			if (!request.session) throw new Error('Server has no sessions')
			if (userId = request.session.userId) result = !!~whitelist.indexOf(userId)

			return result
		}
	}
}

exports.fragments = {
	ops: {
		'': {
			fragment: ['head'],
		},
		'.title': 'title',
		'.app': 'app',
		'.host': 'host',
		'.pid': 'pid',
		'.now': 'now',
		'.nowpt': 'nowPt',
		'.here': 'json',
	},
	head: {
		title: 'title',
	},
}
