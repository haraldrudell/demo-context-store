// socketmaster.js
// see if master's can communicate using a socket rather than the filesystem
// © Harald Rudell 2013

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/net.html
var net = require('net')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/util.html
var util = require('util')
// http://nodejs.org/api/events.html
var events = require('events')

var port = 1113
var interface = '127.0.0.1'
var socketTimeout = 1e3

var p = haraldutil.p
var pps = haraldutil.pps
var pargs = haraldutil.pargs
haraldutil.p_prepend(process.pid)

p('launched')

process.once('exit', processExitListener)
function processExitListener() {
	p('exit', pargs(arguments))
}

process.on('SIGINT', processSigIntListener)
function processSigIntListener() {
	p(pargs(arguments))
	if (masterServer) {
		var s = masterServer
		masterServer = null
		s.shutdown()
	}
}

var masterServer
process.nextTick(startServer)
function startServer() {
	masterServer = new MasterServer(port)
		.on('connect', masterConnect)
		.on('fail', masterBusy)
		.on('end', masterDisconnect)
		.on('error', function (err) {throw err})
	}
function masterConnect() {
	p('Listening...')
}
function masterDisconnect() {
	masterServer = null
	p('Master server disconnected')
}
function masterBusy() {
	masterServer = null
	getPidFromPort(port, getPidResult)
}
function getPidResult(err, pid) {
	if (!err) p('pid:', pid)
	else p(err.message)
}

/*
nodegod Master process server
port: number

'connect': server successfully listening. will emit 'end'
'error'
'fail': the port is busy, final event
'end': the server stopped servicing events, final event
.isUp() boolean: the server is accepting requests

Server createServer(options, connectionListener)
'listening'
'error' err.code == EADDRINUSE
'connection' Socket
'close'
note: if you get error, you don't get close
*/
function MasterServer(port) {
	var self = this
	var listeningFired
	var needClose

	events.EventEmitter.call(this)
	this.shutdown = shutdown
	this.isUp = isUp

	var server = net.createServer(handleConnection)
		.listen(port, interface, listeningListener)
		.on('error', errorListener)
		.on('close', closeListener)
	var unwrap = wrapEmit(server, 'server')

	function listeningListener() {
		listeningFired = needClose = true
		self.emit('connect')
	}
	function closeListener() {
		cleanup()
		if (listeningFired) self.emit('end')
	}
	function errorListener(err) {
		needClose = false
		cleanup()
		if (!listeningFired && err.code == 'EADDRINUSE') self.emit('fail')
		else self.emit('error', err)
	}

	function shutdown() {
		if (needClose) {
			needClose = false
			server.close()
		}
	}
	function isUp() {
		return needClose
	}

	function cleanup() {
		if (unwrap) {
			var s = unwrap
			unwrap = null
			s()
		}
	}
}
util.inherits(MasterServer, events.EventEmitter)

// manage a connection, reponding to requests
function handleConnection(socket) { // server 'connect'
	var socketUnwrap = wrapEmit(socket, 'rxSsocket')
	socket.setEncoding('utf-8')
	socket.on('data', requestResponder)
		.on('close', closeListener)

	function requestResponder(data) {
		socket.end(String(process.pid))
	}

	function closeListener() {
		socketUnwrap()
	}
}

// connect to the port
// connect to port
// send message
// receive pid
/*
retrieve pid from port
'connect'
'drain'
'timeout'
'data' Buffer
'close' (isExceptionBoolean)
'newListener' event function
*/
function getPidFromPort(port, cb) {
	var didCb
	var isClosed
	var socket = net.connect(port, connectionListener)
		.once('timeout', timeoutListener)
		.on('data', dataListener)
		.once('close', closeListener)
	var unwrap = wrapEmit(socket, 'txSocket')
	socket.setTimeout(socketTimeout)
	socket.setEncoding('utf-8')

	function connectionListener() {
		socket.write(String(process.pid)) // string or buffer
	}
	function dataListener(pidString) {
		var result
		var err
		var pid

		if (!isNaN(pid = Number(pidString))) result = pid
		else  err = new Error('Master response corrupt')
		socket.end()
		end(err, result)
	}
	function timeoutListener() {
		socket.destroy() // disconnect immediately, will get close
		end(new Error('Master process not reponding'))
	}
	function closeListener() {
		isClosed = true
		if (unwrap) {
			s = unwrap
			unwrap = null
			s()
		}
	}
	function end(err, pid) {
		if (!didCb) {
			didCb = true
			if (err) cb(err)
			else cb(err, pid)
			socket.end()
		}
	}
}




function wrapEmit(emitter, slogan) {
	var f = arguments.callee.name
	var oldEmit = emitter && emitter.emit

	if (typeof oldEmit == 'function') {
		emitter.emit = eventLogger
		p('added ' + eventLogger.name, slogan)
	} else p(slogan, 'Object not an emitter')

	return  unWrap

	function eventLogger(event) {
		p(slogan, pargs(arguments))

		return oldEmit.apply(emitter, Array.prototype.slice.call(arguments))
	}

	function unWrap() {
		if (oldEmit) emitter.emit = oldEmit
	}
}