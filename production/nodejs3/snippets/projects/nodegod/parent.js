// parent.js

// http://nodejs.org/api/child_process.html
var child_process = require('child_process')
// http://nodejs.org/api/path.html
var path = require('path')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var fileId = __filename.substring(__filename.lastIndexOf('/') + 1)
var args = [path.join(__dirname, 'child')]

/*
child_process.spawn(file, args, options)
file: string: command
args: optional array of string: arguments
options: optional object, default: {cwd: undefined, env: process.env}

the child object emits no events other than exit and close
exit(exitCode: number, signalCode: null)
close(exitCode: number, signalCode: null)
*/
/*
ipc
ipc allows to send a message and a handle between the child and the parent
*/
var t = Date.now()

// 1. launch child
console.log(fileId, 'spawning, parent pid:', process.pid)

child = child_process.spawn('node', args, {
	stdio: [0, 1, 2, 'ipc']
})
	.on('exit', uiExit)
	.on('close', uiClose)
	.on('message', childMessage)
child.hasIpc = typeof child.send == 'function'
console.log(fileId, 'child pid:', child.pid, child.hasIpc ? 'with ipc' : 'no ipc'
	)
logAllEvents(child)

// 2. send message to child
if (child.hasIpc) {
	child.send('abc')
	child.send(Infinity)
	child.send(new Date)
}

// 3. delayed exit
delayExit()

function logAllEvents(x) {
	var _emit = x.emit
	x.emit = function () {
		console.log('FriendsStreamEvent', Array.prototype.slice.call(arguments))
		_emit.apply(this, Array.prototype.slice.call(arguments))
	}
}

function childMessage(message, handle) {
	console.log(fileId, arguments.callee.name, (Date.now() - t) / 1e3,
		haraldutil.inspect(Array.prototype.slice.call(arguments)))
}
function uiExit(exitCode, signalCode) {
	console.log(fileId, arguments.callee.name, (Date.now() - t) / 1e3,
		haraldutil.inspect(Array.prototype.slice.call(arguments)))
}

function uiClose() {
	console.log(fileId, arguments.callee.name, (Date.now() - t) / 1e3,
		haraldutil.inspect(Array.prototype.slice.call(arguments)))
}

function delayExit() {
	console.log(fileId, 'exiting in 3 s', (Date.now() - t) / 1e3)
	setTimeout(f, 3e3)

	function f() {
		console.log(fileId, 'exiting', (Date.now() - t) / 1e3)
		if (child.hasIpc) child.stdio[3].destroy()
	}
}