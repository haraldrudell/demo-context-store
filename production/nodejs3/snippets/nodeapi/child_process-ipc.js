// child_process-ipc.js
// Demonstrate Node.js api
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var child_process = require('child_process') // http://nodejs.org/api/child_process.html

var jsutil = require('../javascript/jsutil')
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var p = jsutil.p
var pEval = jsutil.pEval
var log = haraldutil.p

jsutil.pFileHeader()

//require('haraldutil').p('Starting:', process.pid)

/*
- the parent does not know when the child has launched, so child starts with message
'message' data handle
'error' Error problem spawn, kill or send
'disconnect'
'close' exitCode signal: all stdioi streams terminated
'exit' exitCode

child_process-ipc:24:spawnIpc Parent pid: 18603 Invoked at: 2013-08-28T19:52:41.530Z
child_process-ipc:38:spawnIpc 0.007 child pid: 18609 has ipc: true
child message 'childMessage' undefined
child_process-ipc:41:messageListener 0.054 parent received: childMessage
child disconnect
child_process-ipc:46:disconnectListener 0.059 parent got disconnect
child exit 0 null
child_process-ipc:54:exitListener 0.06 child exit: 0
child close 0 null
*/
spawnIpc()
function spawnIpc() {
	var t0 = Date.now()
	log('Parent pid:', process.pid, 'Invoked at:', new Date(t0).toISOString())

	var command = 'node'
	var args = ['-e', 'childCode(' + t0 + ');' + childCode.toString()]
	var options = {
		stdio: ['ignore', null, null, 'ipc']
	}

	var child = child_process.spawn(command, args, options)
		.on('message', messageListener)
		.once('disconnect', disconnectListener)
		.once('exit', exitListener)
	var unwrap = wrapEmit(child, 'child')
	var cpid = child.pid
	log(String((Date.now() - t0) / 1e3), 'child pid:', cpid, 'has ipc:', !!child.send)

	function messageListener(data, fh) {
		log(String((Date.now() - t0) / 1e3), 'parent received:', data)
		child.send('parentMessage')
	}

	function disconnectListener() {
		log(String((Date.now() - t0) / 1e3), 'parent got disconnect')
	}

	function closeListener() {
		log(String((Date.now() - t0) / 1e3), 'parent got close')
	}

	function exitListener(exitCode) {
		log(String((Date.now() - t0) / 1e3), 'child exit:', exitCode)
	}

	function childCode(t0) {
		console.log(String((Date.now() - t0) / 1e3), 'pid:', process.pid, 'has ipc:', !!process.send)
		if (process.send) process.send('childMessage')
		process.on('message', parentMessage)

		function parentMessage(data, fh) {
			console.log(String((Date.now() - t0) / 1e3), 'child received:', data)
			process.exit()
		}
	}
}

/*
- data forwarded to child as command line code
- child shares stdout with parent

child_process-ipc:65:spawnNoIpc Parent pid: 18538 Invoked at: 2013-08-28T19:46:06.297Z
child_process-ipc:77:spawnNoIpc 0.006 child pid: 18544 has ipc: false
0.048 pid: 18544 has ipc: false
child exit 0 null
child_process-ipc:80:exitListener 0.054 child exit: 0
child close 0 null
*/
//spawnNoIpc()
function spawnNoIpc() {
	var t0 = Date.now()
	log('Parent pid:', process.pid, 'Invoked at:', new Date(t0).toISOString())

	var command = 'node'
	var args = ['-e', 'childCode(' + t0 + ');' + childCode.toString()]
	var options = {
		stdio: 'inherit',
	}

	var child = child_process.spawn(command, args, options)
		.once('exit', exitListener)
	var unwrap = wrapEmit(child, 'child')
	var cpid = child.pid
	log(String((Date.now() - t0) / 1e3), 'child pid:', cpid, 'has ipc:', !!child.send)

	function exitListener(exitCode) {
		log(String((Date.now() - t0) / 1e3), 'child exit:', exitCode)
	}

	function childCode(t0) {
		console.log(String((Date.now() - t0) / 1e3), 'pid:', process.pid, 'has ipc:', !!process.send)
		process.exit()
	}
}

// logger of all emitted events
var inspectObj = {maxString: 20, maxProperties: 0, maxLevels: 0, nonEnum: true}
function wrapEmit(emitter, slogan) {
	var wrappedEmit = emitter.emit
	emitter.emit = emitLogger
	if (!slogan) slogan = 'Event:'
	return unwrap

	function emitLogger() {
		var args = Array.prototype.slice.call(arguments)

		var prints = [slogan, args[0]]
		for (var index in args)
			if (index > 0) prints.push(haraldutil.inspect(args[index], inspectObj))
		console.log.apply(this, prints)

		wrappedEmit.apply(this, args)
	}

	function unwrap() {
		emitter.emit = wrappedEmit
	}
}
