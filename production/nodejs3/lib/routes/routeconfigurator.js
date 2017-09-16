// routeconfigurator.js
// Configures nodejs3 routes
// © Harald Rudell 2012 MIT License
try {
var renderstatics = require('./renderstatics')
var renderroot = require('./renderroot')
var applego = require('applego')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
} catch (e) {
  console.log(e.stack)
  throw e
}
;[
addRoutes, closeDb,
].forEach(function (f) {exports[f.name] = f})

var myStore
var db

function addRoutes(app, defaults) {
	var appData = apprunner.getAppData()

	// fb2 view uses this store
	myStore = applego.store.getStore(path.join(
		haraldutil.getTmpFolder(),
		appData.appId + 'store.json'))
	appData.views.fb2.store = myStore

	// get the lists of views and handlers
	var filter = defaults.noDisplayViews.slice(0)
	for (var redirectView in defaults.pageRedirects) filter.push(redirectView)
	var viewsObject = getViewsObject({
		js: __dirname, views: app.settings.views, ext: app.settings['view engine'],
		filter: filter
	})
	// get the static renderer
	var renderStatic = renderstatics.getHandler({folder: app.settings.views})
	//console.log(viewsObject)

	// configure routes
	// special case for root url
	// harald.no.de: redirect to js.haraldrudell.com
	// js.haraldrudell.com: JavaScript page
	// other root locations: Harald Rudell page
	app.get('/', renderroot.getHandler())

	// configure redirects
	for (var redirect in defaults.pageRedirects) {
		var destUrl = defaults.pageRedirects[redirect]
		app.get('/' + redirect, renderroot.redirectToHostHandler(destUrl))
	}

	// jobs
	if (defaults.jobs) {
		app.get('/' + defaults.jobs.view,
			require('./' + defaults.jobs.view)
			.getHandler(defaults.jobs, defaults.jobs.view))
	}

	// configure statics
	// those are files in view folder without extension
	viewsObject.statics.forEach(function (view) {
		var router = app.get('/' + view, renderStatic)
		// bug in express
		// regexp becomes: /^\/+adg\/?$/
		// does not work since + is special character
		if (view[0] == '+' && router && router.map) {
			// make the '+' not a special regexp character
			var viewRegExp = new RegExp('\\' + view)
			// patch up express' buggy regexp: can't handle '+'
			var routeArray = router.map.get
			// get the last Route object
			var route = routeArray[routeArray.length - 1]
			route.regexp = viewRegExp
		}
	})

	// configure regular views
	var viewsData = appData.views
	viewsObject.views.forEach(function (view) {
		var handler
		if (viewsObject.js.indexOf(view) != -1) {
			// use the specific handler (js file by that name)
			handler = require('./' + view).getHandler(viewsData[view], view)
		} else {
			// create a default renderer
			var title = view.substring(0, 1).toUpperCase() + view.substring(1)
			handler = function(request, response) {
				response.render(view, {
					title: title,
					host: renderroot.getHost(request).host,
				})
			}
		}
		app.get('/' + view, handler)
	})

	// add the facebook authentication callback for fb2
	if (defaults.fb && defaults.fb.fbAuthUri) {
		app.get('/' + defaults.fb.fbAuthUri, require('./fb2').getFbAuth(defaults))
	}

	// add extra /all route
	// /all: render index.ejs providing all available views
	var allViews = viewsObject.views.concat(viewsObject.statics)
	app.get('/all', function(request, response) {
		response.render('index', {
			title: appData.appName + ' - Sitemap',
			routing: allViews,
		})
	})

}

// opts.js: folder for js files
// opts.views: folder for views
// opts.ext: extension for views
// opts.filter: optional string array of views to remove
//
// return object:
// .statics[] views that have no extension
// .views[] views with extension removed
// .js[] found routing files, .js removed
function getViewsObject(opts) {
	var result = {
		statics: [],
		views: [],
		js: []
	}

	addArray('js', opts.js, result.js)
	addArray(opts.ext, opts.views, result.views, result.statics)

	// remove other special views
	if (opts.filter) {
		opts.filter.forEach(function (view) {
			var n = result.views.indexOf(view)
			if (n != -1) result.views.splice(n, 1)
		})
	}

	return result
}

function addArray(ext, folder, array, noExtArray) {
	ext = '.' + ext
	fs.readdirSync(folder).forEach(function (filename) {
		if (haraldutil.getType(path.join(folder, filename)) === true) {
			// it is a file, get extension
			switch (path.extname(filename)) {
			case '':
				if (noExtArray) noExtArray.push(filename)
				break
			case ext:
				array.push(path.basename(filename, ext))
				break
			}
		}
	})
}

// receive defaults, open the database
function openDb(opts, cb) {
	if (!db) {
		mongodb.connect(opts.dburl, opts.dbopts, function (err, dbx) {
			if (!err) {
				db = dbx
				if (cb) cb()
			} else {
				if (cb) cb(err)
				else throw err
			}
		})
	} else if (cb) cb()
}

function closeDb(cb) {
	if (db) {
		var aDb = db
		db = undefined
		aDb.close(function(err) {
			if (cb) cb(err)
			else if(err) console.log('close error:', err)
		})
	} else if (cb) cb(null)
}
