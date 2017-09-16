// net.js
// Demonstrate Node.js' net api
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

var net = require('net') // http://nodejs.org/api/net.html

var jsutil = require('../javascript/jsutil')
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
net.createServer([options], [connectionListener])
net.connect(options, [connectionListener])
net.createConnection(options, [connectionListener])
net.connect(port, [host], [connectListener])
net.createConnection(port, [host], [connectListener])
net.connect(path, [connectListener])
net.createConnection(path, [connectListener])
Class: net.Server
server.listen(port, [host], [backlog], [callback])
server.listen(path, [callback])
server.listen(handle, [callback])
server.close([callback])
server.address()
server.unref()
server.ref()
server.maxConnections
server.connections
server.getConnections(callback)
Event: 'listening'
Event: 'connection'
Event: 'close'
Event: 'error'
Class: net.Socket
new net.Socket([options])
socket.connect(port, [host], [connectListener])
socket.connect(path, [connectListener])
socket.bufferSize
socket.setEncoding([encoding])
socket.write(data, [encoding], [callback])
socket.end([data], [encoding])
socket.destroy()
socket.pause()
socket.resume()
socket.setTimeout(timeout, [callback])
socket.setNoDelay([noDelay])
socket.setKeepAlive([enable], [initialDelay])
socket.address()
socket.unref()
socket.ref()
socket.remoteAddress
socket.remotePort
socket.localAddress
socket.localPort
socket.bytesRead
socket.bytesWritten
Event: 'connect'
Event: 'data'
Event: 'end'
Event: 'timeout'
Event: 'drain'
Event: 'error'
Event: 'close'
net.isIP(input)
net.isIPv4(input)
net.isIPv6(input)
*/

/*
Socket flow
connect
_socketEnd: internal: indicates that EOF was received and the socket is no longer readable
readable
finish
end
error
/*

net.connect(port, [host], [connectListener])
alias for Socket.connect
port: integer
host: string hostname, default 'localhost'
connectListener: optional function

An open socket prevents node from exiting
Sockets timeout after about 20 s

*/
connectSocket()
function connectSocket() {
	var t0 = Date.now()
	var socket = net.connect(80)
		.once('connect', connectListener)
		.once('_socketEnd', socketEndListener)
		.once('end', endListener)
		.on('error', errorListener)
	var unwrap = wrapEmit(socket, 'socket')

	function connectListener() {
		require('haraldutil').p('connect', Date.now() - t0)
	}
	function endListener() {
		require('haraldutil').p('connect', Date.now() - t0)
	}
	function socketEndListener() {
		require('haraldutil').p('connect', Date.now() - t0);
	}
	function errorListener(err) {
		require('haraldutil').pp(err)
	}
}

/*
A closed port

net:138:errorListener object:Error {
  code: 'ECONNREFUSED',
  errno: 'ECONNREFUSED',
  syscall: 'connect',
  (nonE)(get)stack: Error: connect ECONNREFUSED,
      at errnoException (net.js:900:11),
      at Object.afterConnect [as oncomplete] (net.js:891:19),
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'connect ECONNREFUSED',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}
*/
//closedPort()
function closedPort() {
	var socket = net.connect()
		.on('error', errorListener)

	function errorListener(err) {
		require('haraldutil').pp(err)
	}
}

/*
A bad hostname

net:108:errorListener object:Error {
  code: 'ENOTFOUND',
  errno: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  (nonE)(get)stack: Error: getaddrinfo ENOTFOUND,
      at errnoException (dns.js:37:11),
      at Object.onanswer [as oncomplete] (dns.js:124:16),
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'getaddrinfo ENOTFOUND',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}
*/
//socketError()
function socketError() {
	var socket = net.connect(80, '^&')
		.on('error', errorListener)

	function errorListener(err) {
		require('haraldutil').pp(err)
	}
}

/*
Socket object
extends Duplex Readable Stream EventEmitter

net:74 object:Socket {
  _connecting: true,
  _handle: object:TCP {
    fd: 11,
    writeQueueSize: 0,
    owner: recursive-object#1,
    onread: function onread(buffer, offset, length),
    -- prototype: TCP,
    close: function close(),
    ref: function ref(),
    unref: function unref(),
    readStart: function readStart(),
    readStop: function readStop(),
    shutdown: function shutdown(),
    writeBuffer: function writeBuffer(),
    writeAsciiString: function writeAsciiString(),
    writeUtf8String: function writeUtf8String(),
    writeUcs2String: function writeUcs2String(),
    open: function open(),
    bind: function bind(),
    listen: function listen(),
    connect: function connect(),
    bind6: function bind6(),
    connect6: function connect6(),
    getsockname: function getsockname(),
    getpeername: function getpeername(),
    setNoDelay: function setNoDelay(),
    setKeepAlive: function setKeepAlive()
  },
  _readableState: object:ReadableState {
    highWaterMark: 16384,
    buffer: 0[(nonE)length: 0],
    length: 0,
    pipes: null,
    pipesCount: 0,
    flowing: false,
    ended: false,
    endEmitted: false,
    reading: false,
    calledRead: false,
    sync: true,
    needReadable: false,
    emittedReadable: false,
    readableListening: false,
    objectMode: false,
    defaultEncoding: 'utf8',
    ranOut: false,
    awaitDrain: 0,
    readingMore: false,
    decoder: null,
    encoding: null,
    -- prototype: ReadableState
  },
  readable: false,
  domain: null,
  _events: {
    end: function g() {
      listener: function onend()
    },
    finish: function onSocketFinish(),
    _socketEnd: function onSocketEnd()
  },
  _maxListeners: 10,
  _writableState: object:WritableState {
    highWaterMark: 16384,
    objectMode: false,
    needDrain: false,
    ending: false,
    ended: false,
    finished: false,
    decodeStrings: false,
    defaultEncoding: 'utf8',
    length: 0,
    writing: false,
    sync: true,
    bufferProcessing: false,
    onwrite: function (er),
    writecb: null,
    writelen: 0,
    buffer: 0[(nonE)length: 0],
    -- prototype: WritableState
  },
  writable: true,
  allowHalfOpen: false,
  onend: null,
  destroyed: false,
  errorEmitted: false,
  bytesRead: 0,
  _bytesDispatched: 0,
  _pendingData: null,
  _pendingEncoding: '',
  -- prototype: Socket,
  read: function (n),
  listen: function (),
  setTimeout: function (msecs, callback),
  _onTimeout: function (),
  setNoDelay: function (enable),
  setKeepAlive: function (setting, msecs),
  address: function (),
  _read: function (n),
  end: function (data, encoding),
  destroySoon: function (),
  _destroy: function (exception, cb),
  destroy: function (exception),
  _getpeername: function (),
  (get)remoteAddress: undefined,
  (get)remotePort: undefined,
  _getsockname: function (),
  (get)localAddress: undefined,
  (get)localPort: undefined,
  write: function (chunk, encoding, cb),
  _write: function (data, encoding, cb),
  (get)bytesWritten: [getter Exception:TypeError: Cannot read property 'buffer' of undefined],
  connect: function (options, cb),
  ref: function (),
  unref: function (),
  (nonE)(get)readyState: 'closed',
  (nonE)(get)bufferSize: undefined,
  -- prototype: Duplex,
  write: function (chunk, encoding, cb),
  _write: function (chunk, encoding, cb),
  end: function (chunk, encoding, cb),
  -- prototype: Readable,
  push: function (chunk, encoding),
  unshift: function (chunk),
  setEncoding: function (enc),
  read: function (n),
  _read: function (n),
  pipe: function (dest, pipeOpts),
  unpipe: function (dest),
  on: function (ev, fn),
  addListener: recursive-object#63,
  resume: function (),
  pause: function (),
  wrap: function (stream),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#70,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(net.connect())

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
