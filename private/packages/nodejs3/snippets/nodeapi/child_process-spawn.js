// child_process-spawn.js
// Demonstrate Node.js api
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var child_process = require('child_process') // http://nodejs.org/api/child_process.html

var jsutil = require('../javascript/jsutil')
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var p = jsutil.p
var pEval = jsutil.pEval
var log = haraldutil.p

jsutil.pFileHeader()

/*
event flow

child exit 3 null
child close 3 null
*/
//nonzeroExit()
function nonzeroExit() {
	var child = child_process.spawn('node', ['-e', 'process.exit(3)'])
	var unwrap = wrapEmit(child, 'child')
}

/*
Unknown command
process could not be spawned

child error object:Error {...}

events.js:80
        throw er; // Unhandled 'error' event
              ^
Error: spawn ENOENT
    at exports._errnoException (util.js:676:11)
    at Process.ChildProcess._handle.onexit (child_process.js:772:32)
*/
//unknownCommand()
function unknownCommand() {
	var child = child_process.spawn('sdjfhlsk')
	var unwrap = wrapEmit(child, 'child')
}


/*
args must be array
pre-spawn problem

child_process.js:700
  args = args ? args.slice(0) : [];
                     ^
TypeError: Object 5 has no method 'slice'
    at Object.exports.spawn (child_process.js:700:22)
    at argsbad (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/child_process-simpleipc.js:55:16)
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/child_process-simpleipc.js:53:1)
    at Module._compile (module.js:450:26)
    at Object.Module._extensions..js (module.js:468:10)
    at Module.load (module.js:350:32)
    at Function.Module._load (module.js:306:12)
    at Function.Module.runMain (module.js:491:10)
    at startup (node.js:119:16)
    at node.js:792:3
*/
//argsbad()
function argsbad() {
	var child = child_process.spawn('node', 5)
	var unwrap = wrapEmit(child, 'child')
}

/*
command must be string
pre-spawn problem

child_process.js:916
  var err = this._handle.spawn(options);
                         ^
TypeError: Bad argument
    at ChildProcess.spawn (child_process.js:916:26)
    at Object.exports.spawn (child_process.js:716:9)
    at errorChild (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/child_process-simpleipc.js:42:16)
    at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/child_process-simpleipc.js:40:1)
    at Module._compile (module.js:450:26)
    at Object.Module._extensions..js (module.js:468:10)
    at Module.load (module.js:350:32)
    at Function.Module._load (module.js:306:12)
    at Function.Module.runMain (module.js:491:10)
    at startup (node.js:119:16)
    */
//errorChild()
function errorChild() {
	var child = child_process.spawn()
	var unwrap = wrapEmit(child, 'child')
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
