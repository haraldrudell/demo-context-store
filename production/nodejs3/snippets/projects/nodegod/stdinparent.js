// stdinparent.js

/*
conclusions
Parent does not know when child has started, so child needs to send message to parent using ipc
error events for child's stdin are not forwarded to parent
if child stdin is not writable, parent still writes
if child does stdin.destroy, parent gets EPIPE

killing child:
stdinparent:28:emit 'stdin' 1['drain']
stdinparent:21:emit 'child' 1['disconnect']
stdinparent:21:emit 'child' 3['exit', 1, null]
stdinparent:21:emit 'child' 3['close', 1, null]
stdinparent:28:emit 'stdin' 2['close', false]

killing parent:
stdinchild:6:emit 'process' 1['disconnect']
stdinchild:13:emit 'stdin' 2['close', false]
stdinchild:6:emit 'process' 2['exit', 0]

Typical event flow:
stdinchild:6:emit 'process' 3['newListener', 'SIGWINCH', function ()]
stdinchild:13:emit 'stdin' 3['newListener', 'data', function echoData(data)]
child ready
stdinparent:28:emit 'stdin' 3['message', 'ok', undefined]
^Cfoxyboy@c505:~/Desktop/c505/node/nodejs3$ node snippets/projects/nodegod/stdinparent.js
stdinchild:6:emit 'process' 3['newListener', 'SIGWINCH', function ()]
stdinchild:13:emit 'stdin' 3['newListener', 'data', function echoData(data)]
child ready
stdinparent:21:emit 'child' 3['message', 'ok', undefined]
childMessageListener
stdinchild:13:emit 'stdin' 2['data', 'abc\n']
echoData abc
*/

// http://nodejs.org/api/child_process.html
var child_process = require('child_process')

var spawnOptions = {
	stdio: ['pipe', 1, 2, 'ipc'],
}

var child = child_process.spawn('node', [__dirname + '/stdinchild'], spawnOptions)
	.on('message', childMessageListener)

var ce = child.emit
child.emit = function () {
	var args = Array.prototype.slice.call(arguments)
	require('haraldutil').q('child', args)
	ce.apply(child, args)
}

var se = child.stdin.emit
child.stdin.emit = function () {
	var args = Array.prototype.slice.call(arguments)
	require('haraldutil').q('stdin', args)
	se.apply(child.stdin, args)
}

function childMessageListener() {
	console.log(arguments.callee.name)
	child.stdin.write('abc\n')
	setTimeout(f, 1e4)
}

function f() {}