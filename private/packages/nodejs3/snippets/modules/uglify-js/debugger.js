// debugger.js

// https://github.com/mishoo/UglifyJS/
var uglify = require('uglify-js')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/util.html
var util = require('util')

var javascript = 'function a() {\ndebugger\n}\n'
var jsp = uglify.parser
var ast
try {
	ast = jsp.parse(javascript)
} catch (e) {
	console.log(util.format('%s at line:%d column:%d position:%d',
		e.message,
		e.line,
		e.col,
		e.pos))
	throw e
}
console.log(haraldutil.inspectDeep(ast))