// htmltodom.js
// Parse html with jsdom
// © Harald Rudell 2012 MIT License

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// https://github.com/tmpvar/jsdom
var jsdom = require('jsdom')

module.exports = {
	parseHtml: parseHtml,
}

var jQuery

function parseHtml(doc, cb) {
	if (!jQuery) var jQuery = fs.readFileSync(__dirname + '/../../frontendjs/jquery-1.7.2.js', 'utf-8')
	jsdom.env({
		html: doc,
		src: jQuery,
		done: checkParse,
	})
	function checkParse(errors, window) {
		var err
		var result

		if (!errors) {
			if (window && window.$) {
				result = window.$
			} else err = Error('jsdom failed to parse html')
		} else {
			err = Error('jsdom Errors')
			err.errs = errors
		}
		cb(err, result)
	}
}