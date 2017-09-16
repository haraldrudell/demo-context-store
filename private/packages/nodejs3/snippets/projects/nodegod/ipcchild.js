// ipcchild.js
// echo stdin until 'x'
// © Harald Rudell 2012

// http://nodejs.org/api/path.html
var path = require('path')

var processIdentifier = path.basename(__filename, path.extname(__filename)) + ':' + process.pid

process.on('exit', processExitListener)
process.on('SIGINT', processSigIntListener)
process.on('message', processMessageListener)
process.on('disconnect', processDisconnectListener)
if (process.send) {
	require('haraldutil').p('Child sending')
	process.send('abc')
}
require('haraldutil').p(processIdentifier, 'process.send:', !!process.send)

/*
var ipcSocket = process.stdio[3]
require('haraldutil').p(processIdentifier, 'hasIpc:', !!ipcSocket)
*/
// listen to stdin
var stdin = process.openStdin() // stdin.resume, returns stdin
	.on('data', echoData) // returns this
stdin.setEncoding('utf-8') // returns undefined

// welcome the user
console.log('Process:', processIdentifier, 'is reading lines from the keyboard, exit with \'x\'')

function echoData(data) {
	if (data == process.pid + '\n') {

	}

	if (data != 'x\n') require('haraldutil').pp(processIdentifier, data)
	else endApp()
}

function endApp() {
	require('haraldutil').p(processIdentifier)
	stdin.removeListener('data', echoData)
	stdin.pause()
}

function processMessageListener(m, server) {
	require('haraldutil').p(m, !!server)
}
var didDisconnect = true
function processSigIntListener() {
	require('haraldutil').p(processIdentifier)
	if (process.send && ! didDisconnect) {
		didDisconnect = true
		require('haraldutil').p(processIdentifier, 'child disconnecting')
		process.disconnect()
	}
}

function processExitListener() {
	require('haraldutil').p(processIdentifier)
}

function processDisconnectListener() {
	require('haraldutil').p(arguments)
}