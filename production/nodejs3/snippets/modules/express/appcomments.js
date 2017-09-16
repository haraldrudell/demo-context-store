// appcomments.js

//express comments
var express = require('express')

// if an object is provided as options, the server is https
var app = module.exports = express.createServer()
// the new object is from HTTPServer in express http.js
// a constructor argument can be an array of middleware

// configuration for all environments
app.configure(function(){
	// store in the settings property
	app.set('views', __dirname + '/views')
	app.set('view engine', 'ejs')

	// store functions(req, res, err), executed in this order
	// express is connect.middleware
	// lazy-loads from connect/lib/middleware
	// parses post body by mime type
	app.use(express.bodyParser())
	// parse cookies to req.cookies
	app.use(express.cookieParser())
	// use sessions
	app.use(express.session({ secret: "keyboard cat" }))
	// allows real method to be specified in header
	app.use(express.methodOverride())
	// on-request sass to css compiler
	//app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }))
	// http defines this as app.routes.midlleware
	// Router._dispatch
	// executes a configured route, or continues the use chain
	app.use(app.router)
	// serve static files from /public folder
	app.use(express.static(__dirname + '/public'))
})