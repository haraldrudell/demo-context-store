// terminal.js
// Verify how to not get terminated by bash
// © Harald Rudell 2013 <harald@therudells.com> All rights reserved.

/*
conclusions:
Child launched detached with shared stdout/stderr: is killed by bash
Child launched detached with no shared stdio/stdout/stderr: survives

ps -C node -o pid,cmd | grep terminal | awk '{print $1}' | xargs kill
*/

var parentipc = require('./parentipc')
var killprocess = require('./killprocess')
var listenermanager = require('./listenermanager')
// http://nodejs.org/api/child_process.html
var child_process = require('child_process')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/util.html
var util = require('util')

var spawn = {
	file: 'node',
	args: [
		//'--debug-brk',
		path.join(__dirname, 'terminal-child'),
	],
	options: {
		detached: true,
		stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
	}
}

// setup log
var marker = path.basename(__filename, path.extname(__filename)) + ':' + process.pid
var t
function log() {
	if (!t) {
		t = Date.now()
		dt = 0
	} else dt = (Date.now() - t) / 1e3
	console.log(marker, dt, util.format.apply(this, Array.prototype.slice.call(arguments)))
}

log('Starting at:', (new Date).toISOString())

var didStdinResume
var isProcessExit
var childPid
var lm = new listenermanager.ListenerManager
var child = child_process.spawn(spawn.file, spawn.args, spawn.options)
childPid = child.pid
child.unref()
//debugger
var parentIpc = new parentipc.ParentIpc(child)
if (parentIpc.readable) {
	lm.addListener(parentIpc, 'on', 'data', ipcDataListener)
	lm.addListener(child, 'once', 'exit', childExitListener)
	lm.addListener(process.stdin, 'on', 'data', stdinDataListener)
	lm.addListener(process.stdin, 'on', 'handle', stdinDataListener)
	parentIpc.resume()
	didStdinResume = true
	process.stdin.resume()
	log('Child:', child.pid, 'launched. Press Enter to end display of results.')
} else {
	log('Fatal: child process:', child.pid, 'does not support ipc')
	killChildExit()
}

function ipcDataListener(data) {
	log.apply(this, Array.prototype.slice.call(arguments))
}

function stdinDataListener(data) {
	log('Got keystroke, exiting')
	killChildExit()
}

function childExitListener(exitCode) {
	log('Child:', childPid, 'exit:', exitCode)
	processExit()
}

function killChildExit(waitFirst) {
	if (child) {
		var opts = {
			pid: child.pid,
			object: child,
			event: 'exit',
		}
		if (waitFirst) opts.initialWait = true
	}
	killprocess.killProcess(opts, processExit)
}

function processExit(err) {
	if (err) log('processExiterr', err, err.stack)
	if (!isProcessExit) {
		isProcessExit = true
		child = null
		if (lm) {
			lm.removeListeners()
			lm = null
		}
		if (didStdinResume) process.stdin.pause()
		parentIpc.destroy(processExitDone)
	}
}

function processExitDone() {
	log('Exiting')
}
