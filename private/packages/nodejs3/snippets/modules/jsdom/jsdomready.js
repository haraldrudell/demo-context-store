// jsdomready.js

//jsdom.env({
// html: url, html fragment or file
// - if it contains characters other than a-zA-Z0-9_ it is markup
// - if parsed as a url it contains host, it is a web location
// - otherwise it is a filename
// [scripts]: single or array of url or file
// [config] .features FetchExternalResources, ProcessExternalResources, MutationEvents
// encoding headers
// [url] location.href
// [document] HTMLDocument properties] cookies, referrer
// done: function callback(errors: array of error, window object)

// https://github.com/tmpvar/jsdom
var jsdom = require('jsdom')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

// as a string (filename), the script is not executed

var jQuery = fs.readFileSync(__dirname + '/jquery-1.7.2.js', 'utf-8')
var myScript = fs.readFileSync(__dirname + '/myscript.js', 'utf-8')

run('<html><body></body></html>', {},function () {})

function run(doc, opts, cb) {
	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	if (!cb) cb = defCb
	jsdom.env({
		html: doc,
		src: [ myScript, jQuery, myScript ],
		done: function (errors, window) {
			// TODO decide what to do about errors?
			if (errors) console.log(str, 'parsing errors:', errors)

			if (!window) cb(Error('could not parse response html'))
			if (!window.$) cb(Error('jQuery not available'))
			var $ = window.$

			// undefined
			console.log('global:', typeof MYSCRIPT)
			// defined
			console.log('window:', typeof window.MYSCRIPT)
			console.log(window.MYSCRIPT)
			console.log(window.MYSCRIPT.str)

			console.log(str, 'executing onload')
			window.MYSCRIPT.onload()
			console.log(str, 'onload complete')
			console.log(window.MYSCRIPT.str)

			// conclusion: window.document.onload has not executed
			// jsdom has erased the document.onload reference

			// conclusion: you have to load your own script that saves onload

			cb()
		}
	})

	function defCb(err) {
		if (err) throw err
	}
}