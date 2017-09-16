// killprocess.js
// Kill a process gracefully
// © Harald Rudell 2013 <harald@therudells.com> All rights reserved.

exports.killProcess = killProcess

/*
Kill a process
opts: object
.pid: the process id
.object: optional object where to add a listener
.event: optional string: the event tolisten for
.timeout: optional number unit ms default 3 s: timeout between different actions
.initialWait: optional number default no initial wait: wait this time before first kill action. true for using timeout
cb(err): optional function: callback

note: process.kill(undefined) somehow terminates the running process: avoid that
*/
function killProcess(opts, cb) {
	var timeout = opts.timeout > 0 ? +opts.timeout : 3e3
	var initialWait = opts.initialWait === true ? timeout : opts.initialWait > 0 ? +opts.initialWait : false
	var useListener = opts.object && opts.event
	var killTimer

	if (!isNaN(opts.pid) && opts.pid > 0) {
		if (useListener) opts.object.once(opts.event, exitListener)
		if (initialWait !== false) killTimer = setTimeout(sendSigInt, initialWait)
		else sendSigInt()
	} else cb(new Error('bad pid: ' + opts.pid))

	function sendSigInt() {
		sendSignal('SIGINT', sendSigTerm)
	}

	function sendSigTerm() {
		sendSignal(undefined, timeoutExit)
	}

	function timeoutExit() {
		killTimer = null
		end(new Error('Exit event timeout for process: ' + opts.pid))
	}

	function exitListener(exitCode) {
		useListener = false
		end(null, exitCode)
	}

	function end(err, exitCode) {
		if (killTimer) {
			var k = killTimer
			killTimer = null
			clearTimeout(k)
		}
		if (useListener) opts.object.removeListener(opts.event, exitListener)
		if (cb) {
			var cbArgs = []
			if (exitCode != null) cbArgs.push(err, exitCode)
			else if (err) cbArgs.push(err)
			cb.apply(this, cbArgs)
		}
	}

	function sendSignal(signal, cb) {
		killTimer = setTimeout(cb, timeout)
		try {
			process.kill(opts.pid, signal)
		} catch (e) {
			var endArgs = []
			if (e.code !== 'ESRCH') endArgs.push(e) // the process does not exist
			end.apply(this, endArgs)
		}
	}
}
