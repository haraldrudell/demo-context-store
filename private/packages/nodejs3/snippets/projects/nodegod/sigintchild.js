// sigintchild.js
// see if sigint can be ignored in the parent process
// © Harald Rudell 2013

// http://nodejs.org/api/path.html
var path = require('path')

var timer

// setup process
var processName = path.basename(__filename, path.extname(__filename)) + ':' + process.pid
require('haraldutil').p(processName, 'launched')
process.on('SIGINT', processSigIntListener)
process.once('exit', processExitListener)
function processSigIntListener() {
	require('haraldutil').p(processName, 'sigint', require('haraldutil').inspect(Array.prototype.slice.call(arguments)))
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
}
function processExitListener() {
	require('haraldutil').p(processName, 'exit', require('haraldutil').inspect(Array.prototype.slice.call(arguments)))
}

var time = 5e3
require('haraldutil').p(processName, 'Sleeping', time / 1e3, 's')
timer = setTimeout(f, time)
function f() {
	require('haraldutil').p(processName, 'end of period')
	timer = null
}