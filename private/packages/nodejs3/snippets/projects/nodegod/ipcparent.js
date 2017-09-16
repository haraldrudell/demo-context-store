// ipcparent.js
// explore how ipc, stdin and stdout works
// © Harald Rudell 2012

// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/child_process.html
var child_process = require('child_process')

console.log('Parent pid:', process.pid)

var readstdin = require('./readstdin')

process.on('SIGINT', processSigIntListener)

/*
Observations
options: stdio: [0, 1, 2]:
stdin: it is random whether the parent or child process receives input
- all sigint listeners always captures sigint
- if a process does not have a sigint listener, it does nothing
stdout is joined together

for process to exit, stdin needs to be paused

if ipc is used, processes do not exit

ipc parent: (ipc socket at child.stdio[3])
send: child.send
receive: child.on('message')
detect disconnect: child.once('disconnect')
disconnect: child.disconnect()
- can not determine if the child connected, but can determine disconnect and receive messages
- immediately sent message are not received by the child

ipc child:
send: process.send()
receive: process.on('message')
detect disconnect: process.on('disconnect')
disconnect: process.disconnect()

child emits disconnect before exit
pipe end may come before or after exit
the pipe may emit multiple lines of output at once
child 'exit' has two parameters: exit code and a null value
*/
var command = 'node'
var args = [
//	'--debug-brk',
	path.join(__dirname, 'ipcchild'),
]
var options = {
//	stdio: [0, 1, 2, 'ipc'], // parent and child compete for stdio, stdout is shared
//	stdio: ['ignore', 'ignore', 'ignore', 'ipc'], // child uses /dev/null and ipc. child.stdio becomes undefined
	stdio: ['ignore', 'pipe', 'pipe', 'ipc'], // child uses /dev/null and ipc. child.stdio becomes undefined
}
var child = child_process.spawn(command, args, options)
	.on('message', childMessageListener)
	.once('exit', childExitListener)
	.once('disconnect', childDisconnectListener)
child.send('xyz')
require('haraldutil').p('Parent sent')
pipeChildOutput(child)
/*
var ce = child.emit
child.emit = f
function f() {
	require('haraldutil').p(arguments)
	ce.apply(child, Array.prototype.slice.call(arguments))
}
*/
var didDisconnect

function processSigIntListener() {
	require('haraldutil').p()
	if (!didDisconnect) {
		didDisconnect = true
		require('haraldutil').p('parent disconnecting')
		child.disconnect()
	}
}

function childMessageListener() {
	require('haraldutil').p(arguments)
	child.send('a')
}

function childDisconnectListener() {
	require('haraldutil').p(arguments)
}

function childExitListener() {
	require('haraldutil').p(arguments)
}

function pipeChildOutput(child) {
	child.stdout.on('data', log)
		.once('end', endListener)
	child.stderr.on('data', log)
		.once('end', endListener)
	child.stderr.setEncoding('utf-8')
	child.stdout.setEncoding('utf-8')
}

function log() {
	require('haraldutil').p(arguments)
}

function endListener() {
	require('haraldutil').p(arguments)
}