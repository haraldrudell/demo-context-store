// child_process.js
// Demonstrate Node.js api
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var child_process = require('child_process') // http://nodejs.org/api/child_process.html

var jsutil = require('../javascript/jsutil')
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

childFilename = 'child_process-simplechild.js'
var p = jsutil.p
var pEval = jsutil.pEval
var log = haraldutil.p

jsutil.pFileHeader()

//require('haraldutil').pp(new child_process.spawn)
/*
child_process.exec is the best way to run commands

Child Process
Class: ChildProcess
Event: 'error'
Event: 'exit'
Event: 'close'
Event: 'disconnect'
Event: 'message'
child.stdin
child.stdout
child.stderr
child.pid
child.kill([signal])
child.send(message, [sendHandle])
Example: sending server object
Example: sending socket object
child.disconnect()

child_process.exec(command, [options], callback)
child_process.execFile(file, args, options, callback)
child_process.fork(modulePath, [args], [options])
*/

/*
1.      Launching processes
	1.1   child_process.spawn is how child processes are launched
	1.2   child_process.exec spawns a command using the platform's command interpreter
	1.3   child_process.execFile spawns an executable without a command interpreter
	1.4   child_process.fork spawns a node module
*/
p('Launching processes', true)
p('child_process.spawn is how child processes are launched')
p('child_process.exec spawns a command using the platform\'s command interpreter')
p('child_process.execFile spawns an executable without a command interpreter')
p('child_process.fork spawns a node module')

/*
1.      Executing system commands
	1.1   exec runs string commands using the shell executable for the platform
	1.2   .exec returns the process object: require('child_process').exec('qwqwqw').constructor.name
				'ChildProcess'
	1.3   child_process.exec(command, options, callback) callback gets error, stdout and stderr.
	1.4   stdout ands stderr are strings with line terminators of up to 200 KiB, default empty:
				'/bin/sh: 1: qwqwqw: not found\n'
	1.5   error.code is the exit code:
				Error: Command failed: /bin/sh: 1: qwqwqw: not found
 {code: 127, killed: false, signal: null}
	1.6   options.timeout is timeout in ms, default none. Process is killed usinbg SIGTERM:
				Error: Command failed:  {code: null, killed: true, signal: 'SIGTERM'}
*/
p('Executing system commands', true)
p('exec runs string commands using the shell executable for the platform')
pEval('.exec returns the process object', 'require(\'child_process\').exec(\'qwqwqw\').constructor.name')
p('child_process.exec(command, options, callback) callback gets error, stdout and stderr.')
require('child_process').exec('qwqwqw', execResult)
function execResult(error, stdout, stderr) {
	pEval('stdout ands stderr are strings with line terminators of up to 200 KiB, default empty', undefined, undefined, [stderr])
	pEval('error.code is the exit code', undefined, undefined, [error])

	require('child_process').exec('dir', {timeout: 1}, exec2Result)
}
function exec2Result(error, stdout, stderr) {
	pEval('options.timeout is timeout in ms, default none. Process is killed using SIGTERM', undefined, undefined, [error])

	next()
}

/*
child_process.spawn(command, [args], [options])
*/
function next() {
	spawnChild()
}
function spawnChild() {
	var value = 8
	var command = 'node'
	var args = ['-e', 'process.exit(' + value + ')']

	var child = child_process.spawn(command, args)
		.once('exit', exitListener)
	var cpid = child.pid

	function exitListener(exitCode) {
		if (exitCode !== value) throw new Error('Exit code: ' + exitCode)
		else log('Successful exit:', cpid)
	}
}
