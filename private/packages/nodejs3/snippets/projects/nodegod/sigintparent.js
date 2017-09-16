// sigintparent.js
// see if sigint can be ignored in the parent process
// © Harald Rudell 2013

// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/child_process.html
var child_process = require('child_process')

// setup process
var processName = path.basename(__filename, path.extname(__filename)) + ':' + process.pid
require('haraldutil').p(processName, 'launched')
process.on('SIGINT', processSigIntListener)
process.once('exit', processExitListener)
function processSigIntListener() {
	require('haraldutil').p(processName, 'sigint', require('haraldutil').inspect(Array.prototype.slice.call(arguments)))
}
function processExitListener() {
	require('haraldutil').p(processName, 'exit', require('haraldutil').inspect(Array.prototype.slice.call(arguments)))
}

// spawn child
var args = [path.join(__dirname, 'sigintchild')]
var child = child_process.spawn('node', args, {
	stdio: [0, 1, 2]
}).once('exit', childExitListener)
var pid = child.pid
require('haraldutil').p(processName, 'launched child:', pid)

process.stdin.destroy()
require('haraldutil').p('stdin destroyed')

function childExitListener() {
	require('haraldutil').p(processName, 'exit child', pid, require('haraldutil').inspect(Array.prototype.slice.call(arguments)))
}