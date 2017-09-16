// nodeapi-process.js
// © Harald Rudell 2012

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
http://nodejs.org/api/process.html
process
Event: 'exit'
Event: 'uncaughtException'
Signal Events
process.stdout
process.stderr
process.stdin
process.argv
process.execPath
process.abort()
process.chdir(directory)
process.cwd()
process.env
process.exit([code])
process.getgid()
process.setgid(id)
process.getuid()
process.setuid(id)
process.version
process.versions
process.config
process.kill(pid, [signal])
process.pid
process.title
process.arch
process.platform
process.memoryUsage()
process.nextTick(callback)
process.umask([mask])
process.uptime()
process.hrtime()
*/

/*
ipc

From child process with ipc
process.send is only present if the child process was launched with an ipc channel
With ipc, the parent gets a child.send property from spawn
child 'disconnect' (no args) for parent if child closes the ipc channel
process 'disconnect' (no args) for child if parent closes the ipc channel
child.disconnect can only be invoked if the child is listening, ie.
- child.send exists
- no child 'disconnect' has been emitted

process.send(message, handle)
message: any json value
handle optional net.Socket, net.Server, Pipe or TCP
return value: boolean, true if less than 2 items in the send queue

objects in message become the empty object
emits error if the channel is closed
throws if message is not defined
the handle is closed after sending
*/

/*
process 'message' message handle
if no handle, handle is undefined
*/

//console.log(haraldutil.inspectDeep(process))

// { rss: 7147520, heapTotal: 4050688, heapUsed: 2165016 }
console.log('process.memoryUsage:', process.memoryUsage())

// process.hrtime [seconds, nanoseconds]: [ 144778, 607946282 ]
console.log('process.hrtime [seconds, nanoseconds]:', process.hrtime())

// process.uptime: 0.03861941199284047
console.log('process.uptime:', process.uptime())

// can you replace process.exit?
_exit = process.exit
process.exit = f
process.exit(3)
process.exit = _exit
function f(exitCode) {
	console.log('process.exit could be replaced, caught exit:', exitCode)
}