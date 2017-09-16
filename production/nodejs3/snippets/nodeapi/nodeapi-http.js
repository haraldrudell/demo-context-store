// nodeapi-http.js
// demonstrate how to use http in the node.js api
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

/*
HTTP
http.STATUS_CODES
http.createServer([requestListener])
http.createClient([port], [host])
Class: http.Server
Event: 'request'
Event: 'connection'
Event: 'close'
Event: 'checkContinue'
Event: 'connect'
Event: 'upgrade'
Event: 'clientError'
server.listen(port, [hostname], [backlog], [callback])
server.listen(path, [callback])
server.listen(handle, [callback])
server.close([callback])
server.maxHeadersCount
server.setTimeout(msecs, callback)
server.timeout

Class: http.ServerResponse
Event: 'close'
response.writeContinue()
response.writeHead(statusCode, [reasonPhrase], [headers])
response.setTimeout(msecs, callback)
response.statusCode
response.setHeader(name, value)
response.headersSent
response.sendDate
response.getHeader(name)
response.removeHeader(name)
response.write(chunk, [encoding])
response.addTrailers(headers)
response.end([data], [encoding])
http.request(options, callback)
http.get(options, callback)
Class: http.Agent
agent.maxSockets
agent.sockets
agent.requests
http.globalAgent
Class: http.ClientRequest
Event 'response'
Event: 'socket'
Event: 'connect'
Event: 'upgrade'
Event: 'continue'
request.write(chunk, [encoding])
request.end([data], [encoding])
request.abort()
request.setTimeout(timeout, [callback])
request.setNoDelay([noDelay])
request.setSocketKeepAlive([enable], [initialDelay])
http.IncomingMessage
Event: 'data'
Event: 'end'
Event: 'close'
message.httpVersion
message.headers
message.trailers
message.setTimeout(msecs, callback)
message.setEncoding([encoding])
message.pause()
message.resume()
message.method
message.url
message.statusCode
message.socket
*/

var jsutil = require('../javascript/jsutil')

// http://nodejs.org/api/http.html
var http = require('http')
// http://nodejs.org/api/net.html
var net = require('net')
// inspect(v, maxString, maxProperties)
var inspect = require('../projects/haraldutil/inspect')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/util.html
var util = require('util')

var p = jsutil.p
var pEval = jsutil.pEval
var log = console.log

jsutil.pFileHeader()

/*
*/
p('http.createServer', true)
p('http.createServer is an alias for new http.Server extending net.Server, events.eventEmitter')
p('The constructor argument is used as a listener for the request event')
p('The server can listen to a port, unix socket or server/socket/file handle')

/*
http Server object
listen(...): returns the server object, initiates listening
address(): returns an object object with properties port, address, family
close(cb()):

events
'listening'
'connection' instanceof net.Socket
'error' instanceof Error

'request', 'close', 'checkContinue', 'upgrade', 'clientError'
*/
var httpServer = new http.Server(requestListener)
	.on('listening', listeningListener)
	.on('connection', connectionListener)
	.once('close', closeListener)
var port
logEvents(httpServer, 'httpServerEvent')
/*
nodeapi-http:104 object:Server {
  (get)connections: 0,
  _maxListeners: 10,
  allowHalfOpen: true,
  _events: {
    connection: function connectionListener(socket),
    request: function requestListener(request, response)
  },
  _handle: null,
  httpAllowHalfOpen: false,
  domain: null,
  _connections: 0,
  -- prototype: Server,
  -- prototype: Server,
  _setupSlave: function (socketList),
  listenFD: function deprecated(),
  address: function (),
  _listen2: function (address, port, addressType, backlog, fd),
  _emitCloseIfDrained: function (),
  close: function (cb),
  listen: function (),
  -- prototype: EventEmitter,
  addListener: function (type, listener),
  listeners: function (type),
  on: recursive-object#12,
  removeListener: function (type, listener),
  emit: function (),
  once: function (type, listener),
  setMaxListeners: function (n),
  removeAllListeners: function (type)
}
*/
//require('haraldutil').pp(httpServer)

/*
listen(port, host, backlog, callback)
listen(path, callback)
listen(handle, callback)

return value: server object
*/
httpServer.listen()

function listeningListener() { // 'listening' no arguments
	log('listening:', getServerAddress(httpServer))
	port = getServerPort(httpServer)
	/*
	nodeapi-http:162:listeningListener {
	  port: 51031,
	  address: '0.0.0.0',
	  family: 'IPv4'
	}
	*/
	//require('haraldutil').pp(ss)

	var url = 'http://localhost:' + port

	/*
	ClientRequest

	events
	'socket' net.Socket
	'finish'
	'drain'
	'response'
	*/
	/*
	http.get
	options: object
	cb(response): function
	response:
	*/
	var clientRequest = http.get(url, responseListener)
	/*
	nodeapi-http:194:listeningListener object:ClientRequest {
  method: 'GET',
  output: 1['GET / HTTP/1.1\r\nHost: localhost:55007\r\nConnection: keep-alive\r\n\r\n', (nonE)length: 1],
  shouldKeepAlive: true,
  _header: 'GET / HTTP/1.1\r\nHost: localhost:55007\r\nConnection: keep-alive\r\n\r\n',
  _maxListeners: 10,
  socketPath: undefined,
  path: '/',
  sendDate: false,
  _events: {
    response: function g() {
      listener: function response()
    },
    socket: function g() {
      listener: function ()
    }
  },
  _hasBody: true,
  writable: true,
  agent: object:Agent {
    sockets: {
      localhost:55007: 1[object:Socket {
          bytesRead: 0,
          _pendingWriteReqs: 0,
          destroyed: false,
          _flags: 0,
          _maxListeners: 10,
          allowHalfOpen: undefined,
          _bytesDispatched: 0,
          _connectQueueSize: 0,
          _events: {
            free: function (),
            agentRemove: function (),
            close: function (err)
          },
          writable: true,
          _handle: object:TCP {
            onread: function onread(buffer, offset, length),
            owner: recursive-object#11,
            writeQueueSize: 0,
            -- prototype: TCP,
            writeBuffer: function writeBuffer(),
            setNoDelay: function setNoDelay(),
            writeUcs2String: function writeUcs2String(),
            getpeername: function getpeername(),
            bind: function bind(),
            getsockname: function getsockname(),
            shutdown: function shutdown(),
            connect: function connect(),
            setKeepAlive: function setKeepAlive(),
            readStart: function readStart(),
            writeAsciiString: function writeAsciiString(),
            writeUtf8String: function writeUtf8String(),
            bind6: function bind6(),
            close: function close(),
            readStop: function readStop(),
            listen: function listen(),
            connect6: function connect6()
          },
          domain: null,
          errorEmitted: false,
          _connecting: true,
          -- prototype: Socket,
          _destroy: function (exception, cb),
          setNoDelay: function (enable),
          setEncoding: function (encoding),
          destroy: function (exception),
          (get)remotePort: undefined,
          pause: function (),
          (nonE)(get)readyState: 'closed',
          write: function (data, arg1, arg2),
          destroySoon: function (),
          (nonE)(get)bufferSize: undefined,
          address: function (),
          _write: function (data, encoding, cb),
          _connectQueueCleanUp: function (exception),
          connect: function (options, cb),
          (get)bytesWritten: undefined,
          _onTimeout: function (),
          setTimeout: function (msecs, callback),
          setKeepAlive: function (setting, msecs),
          _getpeername: function (),
          end: function (data, encoding),
          resume: function (),
          (get)remoteAddress: undefined,
          listen: function (),
          -- prototype: Stream,
          pipe: function (dest, options),
          -- prototype: EventEmitter,
          addListener: function (type, listener),
          listeners: function (type),
          on: recursive-object#54,
          removeListener: function (type, listener),
          emit: function (),
          once: function (type, listener),
          setMaxListeners: function (n),
          removeAllListeners: function (type)
        }, (nonE)length: 1]
    },
    options: {},
    _maxListeners: 10,
    requests: {},
    _events: {
      free: function (socket, host, port, localAddress)
    },
    maxSockets: 5,
    createConnection: function (),
    domain: null,
    -- prototype: Agent,
    addRequest: function (req, host, port, localAddress),
    removeSocket: function (s, name, host, port, localAddress),
    createSocket: function (name, host, port, localAddress, req),
    defaultPort: 80,
    -- prototype: EventEmitter,
    addListener: recursive-object#54,
    listeners: recursive-object#55,
    on: recursive-object#54,
    removeListener: recursive-object#56,
    emit: recursive-object#57,
    once: recursive-object#58,
    setMaxListeners: recursive-object#59,
    removeAllListeners: recursive-object#60
  },
  outputEncodings: 1[undefined, (nonE)length: 1],
  _last: true,
  _headerSent: true,
  _headers: {
    host: 'localhost:55007'
  },
  _trailer: '',
  useChunkedEncodingByDefault: false,
  _headerNames: {
    host: 'Host'
  },
  chunkedEncoding: false,
  finished: true,
  domain: null,
  -- prototype: ClientRequest,
  setNoDelay: function (),
  _implicitHeader: function (),
  onSocket: function (socket),
  setSocketKeepAlive: function (),
  abort: function (),
  setTimeout: function (msecs, callback),
  clearTimeout: function (cb),
  _deferToConnect: function (method, arguments_, cb),
  -- prototype: OutgoingMessage,
  addTrailers: function (headers),
  destroy: function (error),
  write: function (chunk, encoding),
  _flush: function (),
  _finish: function (),
  _buffer: function (data, encoding),
  _send: function (data, encoding),
  _storeHeader: function (firstLine, headers),
  setHeader: function (name, value),
  getHeader: function (name),
  removeHeader: function (name),
  _writeRaw: function (data, encoding),
  end: function (data, encoding),
  _renderHeaders: function (),
  -- prototype: Stream,
  pipe: recursive-object#53,
  -- prototype: EventEmitter,
  addListener: recursive-object#54,
  listeners: recursive-object#55,
  on: recursive-object#54,
  removeListener: recursive-object#56,
  emit: recursive-object#57,
  once: recursive-object#58,
  setMaxListeners: recursive-object#59,
  removeAllListeners: recursive-object#60
}
*/
	//require('haraldutil').pp(clientRequest)
	logEvents(clientRequest, 'clientRequestEvent')
}

function connectionListener(socket) {
	log('connection from:', getSocketAddress(socket))
	/*
	nodeapi-http:190:connectionListener object:Socket {
  readable: true,
  bytesRead: 0,
  _pendingWriteReqs: 0,
  destroyed: false,
  server: object:Server {
    (get)connections: 1,
    _maxListeners: 10,
    allowHalfOpen: true,
    _connectionKey: 'null:0.0.0.0:0',
    _events: {
      connection: 2[function connectionListener(socket), function connectionListener(socket), (nonE)length: 2],
      request: function requestListener(request, response),
      listening: function listeningListener()
    },
    emit: function logEvent(e),
    _handle: object:TCP {
      onconnection: function onconnection(clientHandle),
      owner: recursive-object#2,
      writeQueueSize: 0,
      -- prototype: TCP,
      writeBuffer: function writeBuffer(),
      setNoDelay: function setNoDelay(),
      writeUcs2String: function writeUcs2String(),
      getpeername: function getpeername(),
      bind: function bind(),
      getsockname: function getsockname(),
      shutdown: function shutdown(),
      connect: function connect(),
      setKeepAlive: function setKeepAlive(),
      readStart: function readStart(),
      writeAsciiString: function writeAsciiString(),
      writeUtf8String: function writeUtf8String(),
      bind6: function bind6(),
      close: function close(),
      readStop: function readStop(),
      listen: function listen(),
      connect6: function connect6()
    },
    httpAllowHalfOpen: false,
    domain: null,
    _connections: 1,
    -- prototype: Server,
    -- prototype: Server,
    _setupSlave: function (socketList),
    listenFD: function deprecated(),
    address: function (),
    _listen2: function (address, port, addressType, backlog, fd),
    _emitCloseIfDrained: function (),
    close: function (cb),
    listen: function (),
    -- prototype: EventEmitter,
    emit: function (),
    addListener: function (type, listener),
    listeners: function (type),
    on: recursive-object#37,
    removeListener: function (type, listener),
    once: function (type, listener),
    setMaxListeners: function (n),
    removeAllListeners: function (type)
  },
  _flags: 0,
  _maxListeners: 10,
  allowHalfOpen: true,
  _bytesDispatched: 0,
  _idleNext: object:Timer {
    _idleNext: recursive-object#1,
    _idlePrev: recursive-object#1,
    ontimeout: function (),
    -- prototype: Timer,
    again: function again(),
    getRepeat: function getRepeat(),
    setRepeat: function setRepeat(),
    close: function close(),
    start: function start(),
    stop: function stop()
  },
  _connectQueueSize: 0,
  _events: {
    error: function (e),
    timeout: function g() {
      listener: function ()
    },
    drain: function ondrain(),
    close: function serverSocketCloseListener()
  },
  _idleStart: Date(1363993098822),
  writable: true,
  _idlePrev: recursive-object#43,
  ondata: function (d, start, end),
  onend: function (),
  _handle: object:TCP {
    onread: function onread(buffer, offset, length),
    owner: recursive-object#1,
    writeQueueSize: 0,
    -- prototype: TCP,
    writeBuffer: recursive-object#12,
    setNoDelay: recursive-object#13,
    writeUcs2String: recursive-object#14,
    getpeername: recursive-object#15,
    bind: recursive-object#16,
    getsockname: recursive-object#17,
    shutdown: recursive-object#18,
    connect: recursive-object#19,
    setKeepAlive: recursive-object#20,
    readStart: recursive-object#21,
    writeAsciiString: recursive-object#22,
    writeUtf8String: recursive-object#23,
    bind6: recursive-object#24,
    close: recursive-object#25,
    readStop: recursive-object#26,
    listen: recursive-object#27,
    connect6: recursive-object#28
  },
  _idleTimeout: 120000,
  parser: object:HTTPParser {
    onHeaders: function parserOnHeaders(headers, url),
    maxHeaderPairs: 2000,
    onHeadersComplete: function parserOnHeadersComplete(info),
    onMessageComplete: function parserOnMessageComplete(),
    incoming: null,
    _url: '',
    _headers: 0[(nonE)length: 0],
    onIncoming: function (req, shouldKeepAlive),
    onBody: function parserOnBody(b, start, len),
    socket: recursive-object#1,
    -- prototype: HTTPParser,
    finish: function finish(),
    reinitialize: function reinitialize(),
    execute: function execute()
  },
  domain: null,
  errorEmitted: false,
  -- prototype: Socket,
  _destroy: function (exception, cb),
  setNoDelay: function (enable),
  setEncoding: function (encoding),
  destroy: function (exception),
  (get)remotePort: undefined,
  pause: function (),
  (nonE)(get)readyState: 'closed',
  write: function (data, arg1, arg2),
  destroySoon: function (),
  (nonE)(get)bufferSize: undefined,
  address: function (),
  _write: function (data, encoding, cb),
  _connectQueueCleanUp: function (exception),
  connect: function (options, cb),
  (get)bytesWritten: undefined,
  _onTimeout: function (),
  setTimeout: function (msecs, callback),
  setKeepAlive: function (setting, msecs),
  _getpeername: function (),
  end: function (data, encoding),
  resume: function (),
  (get)remoteAddress: undefined,
  listen: function (),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  addListener: recursive-object#37,
  listeners: recursive-object#38,
  on: recursive-object#37,
  removeListener: recursive-object#39,
  emit: recursive-object#36,
  once: recursive-object#40,
  setMaxListeners: recursive-object#41,
  removeAllListeners: recursive-object#42
}
*/
	//require('haraldutil').pp(socket)
}

function requestListener(request, response) {
	log('request', getRequestDescription(request))
/*
nodeapi-http:364:requestListener object:IncomingMessage {
  readable: true,
  method: 'GET',
  headers: {
    connection: 'keep-alive',
    host: 'localhost:39491'
  },
  httpVersionMinor: 1,
  httpVersion: '1.1',
  url: '/',
  complete: false,
  _pendings: 0[(nonE)length: 0],
  connection: object:Socket {
    readable: true,
    bytesRead: 65,
    _pendingWriteReqs: 0,
    destroyed: false,
    _httpMessage: object:ServerResponse {
      output: 0[(nonE)length: 0],
      shouldKeepAlive: true,
      connection: recursive-object#4,
      _maxListeners: 10,
      sendDate: true,
      _events: {
        finish: function ()
      },
      _hasBody: true,
      writable: true,
      outputEncodings: 0[(nonE)length: 0],
      _last: false,
      _trailer: '',
      useChunkedEncodingByDefault: true,
      chunkedEncoding: false,
      socket: recursive-object#4,
      finished: false,
      domain: null,
      -- prototype: ServerResponse,
      writeHead: function (statusCode),
      _implicitHeader: function (),
      assignSocket: function (socket),
      writeContinue: function (),
      statusCode: 200,
      detachSocket: function (socket),
      writeHeader: function (),
      -- prototype: OutgoingMessage,
      addTrailers: function (headers),
      destroy: function (error),
      write: function (chunk, encoding),
      _flush: function (),
      _finish: function (),
      _buffer: function (data, encoding),
      _send: function (data, encoding),
      _storeHeader: function (firstLine, headers),
      setHeader: function (name, value),
      getHeader: function (name),
      removeHeader: function (name),
      _writeRaw: function (data, encoding),
      end: function (data, encoding),
      _renderHeaders: function (),
      -- prototype: Stream,
      pipe: function (dest, options),
      -- prototype: EventEmitter,
      addListener: function (type, listener),
      listeners: function (type),
      on: recursive-object#31,
      removeListener: function (type, listener),
      emit: function (),
      once: function (type, listener),
      setMaxListeners: function (n),
      removeAllListeners: function (type)
    },
    server: object:Server {
      (get)connections: 1,
      _maxListeners: 10,
      allowHalfOpen: true,
      _connectionKey: 'null:0.0.0.0:0',
      _events: {
        connection: 2[function connectionListener(socket), function connectionListener(socket), (nonE)length: 2],
        request: function requestListener(request, response),
        listening: function listeningListener()
      },
      emit: function logEvent(e),
      _handle: object:TCP {
        onconnection: function onconnection(clientHandle),
        owner: recursive-object#38,
        writeQueueSize: 0,
        -- prototype: TCP,
        writeBuffer: function writeBuffer(),
        setNoDelay: function setNoDelay(),
        writeUcs2String: function writeUcs2String(),
        getpeername: function getpeername(),
        bind: function bind(),
        getsockname: function getsockname(),
        shutdown: function shutdown(),
        connect: function connect(),
        setKeepAlive: function setKeepAlive(),
        readStart: function readStart(),
        writeAsciiString: function writeAsciiString(),
        writeUtf8String: function writeUtf8String(),
        bind6: function bind6(),
        close: function close(),
        readStop: function readStop(),
        listen: function listen(),
        connect6: function connect6()
      },
      httpAllowHalfOpen: false,
      domain: null,
      _connections: 1,
      -- prototype: Server,
      -- prototype: Server,
      _setupSlave: function (socketList),
      listenFD: function deprecated(),
      address: function (),
      _listen2: function (address, port, addressType, backlog, fd),
      _emitCloseIfDrained: function (),
      close: function (cb),
      listen: function (),
      -- prototype: EventEmitter,
      emit: recursive-object#34,
      addListener: recursive-object#31,
      listeners: recursive-object#32,
      on: recursive-object#31,
      removeListener: recursive-object#33,
      once: recursive-object#35,
      setMaxListeners: recursive-object#36,
      removeAllListeners: recursive-object#37
    },
    _flags: 0,
    _maxListeners: 10,
    allowHalfOpen: true,
    _bytesDispatched: 0,
    _idleNext: object:Timer {
      _idleNext: recursive-object#4,
      _idlePrev: recursive-object#4,
      ontimeout: function (),
      -- prototype: Timer,
      again: function again(),
      getRepeat: function getRepeat(),
      setRepeat: function setRepeat(),
      close: function close(),
      start: function start(),
      stop: function stop()
    },
    _connectQueueSize: 0,
    _events: {
      error: function (e),
      timeout: function g() {
        listener: function ()
      },
      drain: function ondrain(),
      close: 2[function serverSocketCloseListener(), function onServerResponseClose(), (nonE)length: 2]
    },
    _idleStart: Date(1363994448009),
    writable: true,
    _idlePrev: recursive-object#72,
    ondata: function (d, start, end),
    onend: function (),
    _handle: object:TCP {
      onread: function onread(buffer, offset, length),
      owner: recursive-object#4,
      writeQueueSize: 0,
      -- prototype: TCP,
      writeBuffer: recursive-object#48,
      setNoDelay: recursive-object#49,
      writeUcs2String: recursive-object#50,
      getpeername: recursive-object#51,
      bind: recursive-object#52,
      getsockname: recursive-object#53,
      shutdown: recursive-object#54,
      connect: recursive-object#55,
      setKeepAlive: recursive-object#56,
      readStart: recursive-object#57,
      writeAsciiString: recursive-object#58,
      writeUtf8String: recursive-object#59,
      bind6: recursive-object#60,
      close: recursive-object#61,
      readStop: recursive-object#62,
      listen: recursive-object#63,
      connect6: recursive-object#64
    },
    _peername: {
      port: 40251,
      address: '127.0.0.1',
      family: 'IPv4'
    },
    _idleTimeout: 120000,
    parser: object:HTTPParser {
      onHeaders: function parserOnHeaders(headers, url),
      maxHeaderPairs: 2000,
      onHeadersComplete: function parserOnHeadersComplete(info),
      onMessageComplete: function parserOnMessageComplete(),
      incoming: recursive-object#1,
      _url: '',
      _headers: 0[(nonE)length: 0],
      onIncoming: function (req, shouldKeepAlive),
      onBody: function parserOnBody(b, start, len),
      socket: recursive-object#4,
      -- prototype: HTTPParser,
      finish: function finish(),
      reinitialize: function reinitialize(),
      execute: function execute()
    },
    domain: null,
    errorEmitted: false,
    -- prototype: Socket,
    _destroy: function (exception, cb),
    setNoDelay: function (enable),
    setEncoding: function (encoding),
    destroy: function (exception),
    (get)remotePort: undefined,
    pause: function (),
    (nonE)(get)readyState: 'closed',
    write: function (data, arg1, arg2),
    destroySoon: function (),
    (nonE)(get)bufferSize: undefined,
    address: function (),
    _write: function (data, encoding, cb),
    _connectQueueCleanUp: function (exception),
    connect: function (options, cb),
    (get)bytesWritten: undefined,
    _onTimeout: function (),
    setTimeout: function (msecs, callback),
    setKeepAlive: function (setting, msecs),
    _getpeername: function (),
    end: function (data, encoding),
    resume: function (),
    (get)remoteAddress: undefined,
    listen: function (),
    -- prototype: Stream,
    pipe: recursive-object#30,
    -- prototype: EventEmitter,
    addListener: recursive-object#31,
    listeners: recursive-object#32,
    on: recursive-object#31,
    removeListener: recursive-object#33,
    emit: recursive-object#34,
    once: recursive-object#35,
    setMaxListeners: recursive-object#36,
    removeAllListeners: recursive-object#37
  },
  statusCode: null,
  _maxListeners: 10,
  _endEmitted: false,
  upgrade: false,
  _paused: false,
  _events: null,
  client: recursive-object#4,
  trailers: {},
  httpVersionMajor: 1,
  socket: recursive-object#4,
  domain: null,
  -- prototype: IncomingMessage,
  setEncoding: function (encoding),
  destroy: function (error),
  pause: function (),
  _addHeaderLine: function (field, value),
  _emitPending: function (callback),
  _emitEnd: function (),
  resume: function (),
  _emitData: function (d),
  -- prototype: Stream,
  pipe: recursive-object#30,
  -- prototype: EventEmitter,
  addListener: recursive-object#31,
  listeners: recursive-object#32,
  on: recursive-object#31,
  removeListener: recursive-object#33,
  emit: recursive-object#34,
  once: recursive-object#35,
  setMaxListeners: recursive-object#36,
  removeAllListeners: recursive-object#37
}
*/
/*
nodeapi-http:638:requestListener object:ServerResponse {
  output: 0[(nonE)length: 0],
  shouldKeepAlive: true,
  connection: object:Socket {
    readable: true,
    bytesRead: 65,
    _pendingWriteReqs: 0,
    destroyed: false,
    _httpMessage: recursive-object#1,
    server: object:Server {
      (get)connections: 1,
      _maxListeners: 10,
      allowHalfOpen: true,
      _connectionKey: 'null:0.0.0.0:0',
      _events: {
        connection: 2[function connectionListener(socket), function connectionListener(socket), (nonE)length: 2],
        request: function requestListener(request, response),
        listening: function listeningListener()
      },
      emit: function logEvent(e),
      _handle: object:TCP {
        onconnection: function onconnection(clientHandle),
        owner: recursive-object#4,
        writeQueueSize: 0,
        -- prototype: TCP,
        writeBuffer: function writeBuffer(),
        setNoDelay: function setNoDelay(),
        writeUcs2String: function writeUcs2String(),
        getpeername: function getpeername(),
        bind: function bind(),
        getsockname: function getsockname(),
        shutdown: function shutdown(),
        connect: function connect(),
        setKeepAlive: function setKeepAlive(),
        readStart: function readStart(),
        writeAsciiString: function writeAsciiString(),
        writeUtf8String: function writeUtf8String(),
        bind6: function bind6(),
        close: function close(),
        readStop: function readStop(),
        listen: function listen(),
        connect6: function connect6()
      },
      httpAllowHalfOpen: false,
      domain: null,
      _connections: 1,
      -- prototype: Server,
      -- prototype: Server,
      _setupSlave: function (socketList),
      listenFD: function deprecated(),
      address: function (),
      _listen2: function (address, port, addressType, backlog, fd),
      _emitCloseIfDrained: function (),
      close: function (cb),
      listen: function (),
      -- prototype: EventEmitter,
      emit: function (),
      addListener: function (type, listener),
      listeners: function (type),
      on: recursive-object#39,
      removeListener: function (type, listener),
      once: function (type, listener),
      setMaxListeners: function (n),
      removeAllListeners: function (type)
    },
    _flags: 0,
    _maxListeners: 10,
    allowHalfOpen: true,
    _bytesDispatched: 0,
    _idleNext: object:Timer {
      _idleNext: recursive-object#3,
      _idlePrev: recursive-object#3,
      ontimeout: function (),
      -- prototype: Timer,
      again: function again(),
      getRepeat: function getRepeat(),
      setRepeat: function setRepeat(),
      close: function close(),
      start: function start(),
      stop: function stop()
    },
    _connectQueueSize: 0,
    _events: {
      error: function (e),
      timeout: function g() {
        listener: function ()
      },
      drain: function ondrain(),
      close: 2[function serverSocketCloseListener(), function onServerResponseClose(), (nonE)length: 2]
    },
    _idleStart: Date(1363995103192),
    writable: true,
    _idlePrev: recursive-object#45,
    ondata: function (d, start, end),
    onend: function (),
    _handle: object:TCP {
      onread: function onread(buffer, offset, length),
      owner: recursive-object#3,
      writeQueueSize: 0,
      -- prototype: TCP,
      writeBuffer: recursive-object#14,
      setNoDelay: recursive-object#15,
      writeUcs2String: recursive-object#16,
      getpeername: recursive-object#17,
      bind: recursive-object#18,
      getsockname: recursive-object#19,
      shutdown: recursive-object#20,
      connect: recursive-object#21,
      setKeepAlive: recursive-object#22,
      readStart: recursive-object#23,
      writeAsciiString: recursive-object#24,
      writeUtf8String: recursive-object#25,
      bind6: recursive-object#26,
      close: recursive-object#27,
      readStop: recursive-object#28,
      listen: recursive-object#29,
      connect6: recursive-object#30
    },
    _peername: {
      port: 42170,
      address: '127.0.0.1',
      family: 'IPv4'
    },
    _idleTimeout: 120000,
    parser: object:HTTPParser {
      onHeaders: function parserOnHeaders(headers, url),
      maxHeaderPairs: 2000,
      onHeadersComplete: function parserOnHeadersComplete(info),
      onMessageComplete: function parserOnMessageComplete(),
      incoming: object:IncomingMessage {
        readable: true,
        method: 'GET',
        headers: {
          connection: 'keep-alive',
          host: 'localhost:50321'
        },
        httpVersionMinor: 1,
        httpVersion: '1.1',
        url: '/',
        complete: false,
        _pendings: 0[(nonE)length: 0],
        connection: recursive-object#3,
        statusCode: null,
        _maxListeners: 10,
        _endEmitted: false,
        upgrade: false,
        _paused: false,
        _events: null,
        client: recursive-object#3,
        trailers: {},
        httpVersionMajor: 1,
        socket: recursive-object#3,
        domain: null,
        -- prototype: IncomingMessage,
        setEncoding: function (encoding),
        destroy: function (error),
        pause: function (),
        _addHeaderLine: function (field, value),
        _emitPending: function (callback),
        _emitEnd: function (),
        resume: function (),
        _emitData: function (d),
        -- prototype: Stream,
        pipe: function (dest, options),
        -- prototype: EventEmitter,
        addListener: recursive-object#39,
        listeners: recursive-object#40,
        on: recursive-object#39,
        removeListener: recursive-object#41,
        emit: recursive-object#38,
        once: recursive-object#42,
        setMaxListeners: recursive-object#43,
        removeAllListeners: recursive-object#44
      },
      _url: '',
      _headers: 0[(nonE)length: 0],
      onIncoming: function (req, shouldKeepAlive),
      onBody: function parserOnBody(b, start, len),
      socket: recursive-object#3,
      -- prototype: HTTPParser,
      finish: function finish(),
      reinitialize: function reinitialize(),
      execute: function execute()
    },
    domain: null,
    errorEmitted: false,
    -- prototype: Socket,
    _destroy: function (exception, cb),
    setNoDelay: function (enable),
    setEncoding: function (encoding),
    destroy: function (exception),
    (get)remotePort: undefined,
    pause: function (),
    (nonE)(get)readyState: 'closed',
    write: function (data, arg1, arg2),
    destroySoon: function (),
    (nonE)(get)bufferSize: undefined,
    address: function (),
    _write: function (data, encoding, cb),
    _connectQueueCleanUp: function (exception),
    connect: function (options, cb),
    (get)bytesWritten: undefined,
    _onTimeout: function (),
    setTimeout: function (msecs, callback),
    setKeepAlive: function (setting, msecs),
    _getpeername: function (),
    end: function (data, encoding),
    resume: function (),
    (get)remoteAddress: undefined,
    listen: function (),
    -- prototype: Stream,
    pipe: recursive-object#83,
    -- prototype: EventEmitter,
    addListener: recursive-object#39,
    listeners: recursive-object#40,
    on: recursive-object#39,
    removeListener: recursive-object#41,
    emit: recursive-object#38,
    once: recursive-object#42,
    setMaxListeners: recursive-object#43,
    removeAllListeners: recursive-object#44
  },
  _maxListeners: 10,
  sendDate: true,
  _events: {
    finish: function ()
  },
  _hasBody: true,
  writable: true,
  outputEncodings: 0[(nonE)length: 0],
  _last: false,
  _trailer: '',
  useChunkedEncodingByDefault: true,
  chunkedEncoding: false,
  socket: recursive-object#3,
  finished: false,
  domain: null,
  -- prototype: ServerResponse,
  writeHead: function (statusCode),
  _implicitHeader: function (),
  assignSocket: function (socket),
  writeContinue: function (),
  statusCode: 200,
  detachSocket: function (socket),
  writeHeader: function (),
  -- prototype: OutgoingMessage,
  addTrailers: function (headers),
  destroy: function (error),
  write: function (chunk, encoding),
  _flush: function (),
  _finish: function (),
  _buffer: function (data, encoding),
  _send: function (data, encoding),
  _storeHeader: function (firstLine, headers),
  setHeader: function (name, value),
  getHeader: function (name),
  removeHeader: function (name),
  _writeRaw: function (data, encoding),
  end: function (data, encoding),
  _renderHeaders: function (),
  -- prototype: Stream,
  pipe: recursive-object#83,
  -- prototype: EventEmitter,
  addListener: recursive-object#39,
  listeners: recursive-object#40,
  on: recursive-object#39,
  removeListener: recursive-object#41,
  emit: recursive-object#38,
  once: recursive-object#42,
  setMaxListeners: recursive-object#43,
  removeAllListeners: recursive-object#44
}
*/
	//require('haraldutil').pp(response)

	var statusCode = 200
	// response
	// .statusCode
	// texts: http.STATUS_CODES[statusCode]
	//console.log(inspect(response))
	var reply = {
		statusCode: statusCode, // integer Number
		headers: { 'Content': 'text/plain' }, // object of strings
		data: http.STATUS_CODES[statusCode], // string or Buffer
	}
	response.writeHead(reply.statusCode, reply.headers)
	// response.write
	response.end(request.method !== 'HEAD' ? reply.data : false)
}

function responseListener(response) {
//debugger
/*
nodeapi-http:1118:responseListener { domain: null,
  _events: null,
  _maxListeners: 10,
  socket:
   { domain: null,
     _events:
      { free: [Function],
        close: [Object],
        agentRemove: [Function],
        drain: [Function: ondrain],
        error: [Function: socketErrorListener] },
     _maxListeners: 10,
     _handle:
      { writeQueueSize: 0,
        owner: [Circular],
        onread: [Function: onread] },
     _pendingWriteReqs: 0,
     _flags: 0,
     _connectQueueSize: 0,
     destroyed: false,
     errorEmitted: false,
     bytesRead: 141,
     _bytesDispatched: 65,
     allowHalfOpen: undefined,
     _connecting: false,
     writable: true,
     parser:
      { _headers: [],
        _url: '',
        onHeaders: [Function: parserOnHeaders],
        onHeadersComplete: [Function: parserOnHeadersComplete],
        onBody: [Function: parserOnBody],
        onMessageComplete: [Function: parserOnMessageComplete],
        socket: [Circular],
        incoming: [Circular],
        maxHeaderPairs: 2000,
        onIncoming: [Function: parserOnIncomingClient] },
     _httpMessage:
      { domain: null,
        _events: {},
        _maxListeners: 10,
        output: [],
        outputEncodings: [],
        writable: true,
        _last: true,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: false,
        sendDate: false,
        _hasBody: true,
        _trailer: '',
        finished: true,
        agent: [Object],
        socketPath: undefined,
        method: 'GET',
        path: '/',
        _headers: [Object],
        _headerNames: [Object],
        _header: 'GET / HTTP/1.1\r\nHost: localhost:38337\r\nConnection: keep-alive\r\n\r\n',
        _headerSent: true,
        emit: [Function: logEvent],
        socket: [Circular],
        connection: [Circular],
        parser: [Object],
        res: [Circular] },
     ondata: [Function: socketOnData],
     onend: [Function: socketOnEnd],
     _peername: { address: '127.0.0.1', family: 'IPv4', port: 38337 },
     _connectQueue: null,
     readable: true },
  connection:
   { domain: null,
     _events:
      { free: [Function],
        close: [Object],
        agentRemove: [Function],
        drain: [Function: ondrain],
        error: [Function: socketErrorListener] },
     _maxListeners: 10,
     _handle:
      { writeQueueSize: 0,
        owner: [Circular],
        onread: [Function: onread] },
     _pendingWriteReqs: 0,
     _flags: 0,
     _connectQueueSize: 0,
     destroyed: false,
     errorEmitted: false,
     bytesRead: 141,
     _bytesDispatched: 65,
     allowHalfOpen: undefined,
     _connecting: false,
     writable: true,
     parser:
      { _headers: [],
        _url: '',
        onHeaders: [Function: parserOnHeaders],
        onHeadersComplete: [Function: parserOnHeadersComplete],
        onBody: [Function: parserOnBody],
        onMessageComplete: [Function: parserOnMessageComplete],
        socket: [Circular],
        incoming: [Circular],
        maxHeaderPairs: 2000,
        onIncoming: [Function: parserOnIncomingClient] },
     _httpMessage:
      { domain: null,
        _events: {},
        _maxListeners: 10,
        output: [],
        outputEncodings: [],
        writable: true,
        _last: true,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: false,
        sendDate: false,
        _hasBody: true,
        _trailer: '',
        finished: true,
        agent: [Object],
        socketPath: undefined,
        method: 'GET',
        path: '/',
        _headers: [Object],
        _headerNames: [Object],
        _header: 'GET / HTTP/1.1\r\nHost: localhost:38337\r\nConnection: keep-alive\r\n\r\n',
        _headerSent: true,
        emit: [Function: logEvent],
        socket: [Circular],
        connection: [Circular],
        parser: [Object],
        res: [Circular] },
     ondata: [Function: socketOnData],
     onend: [Function: socketOnEnd],
     _peername: { address: '127.0.0.1', family: 'IPv4', port: 38337 },
     _connectQueue: null,
     readable: true },
  httpVersion: '1.1',
  complete: false,
  headers:
   { content: 'text/plain',
     date: 'Fri, 22 Mar 2013 23:41:19 GMT',
     connection: 'keep-alive',
     'transfer-encoding': 'chunked' },
  trailers: {},
  readable: true,
  _paused: false,
  _pendings: [],
  _endEmitted: false,
  url: '',
  method: null,
  statusCode: 200,
  client:
   { domain: null,
     _events:
      { free: [Function],
        close: [Object],
        agentRemove: [Function],
        drain: [Function: ondrain],
        error: [Function: socketErrorListener] },
     _maxListeners: 10,
     _handle:
      { writeQueueSize: 0,
        owner: [Circular],
        onread: [Function: onread] },
     _pendingWriteReqs: 0,
     _flags: 0,
     _connectQueueSize: 0,
     destroyed: false,
     errorEmitted: false,
     bytesRead: 141,
     _bytesDispatched: 65,
     allowHalfOpen: undefined,
     _connecting: false,
     writable: true,
     parser:
      { _headers: [],
        _url: '',
        onHeaders: [Function: parserOnHeaders],
        onHeadersComplete: [Function: parserOnHeadersComplete],
        onBody: [Function: parserOnBody],
        onMessageComplete: [Function: parserOnMessageComplete],
        socket: [Circular],
        incoming: [Circular],
        maxHeaderPairs: 2000,
        onIncoming: [Function: parserOnIncomingClient] },
     _httpMessage:
      { domain: null,
        _events: {},
        _maxListeners: 10,
        output: [],
        outputEncodings: [],
        writable: true,
        _last: true,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: false,
        sendDate: false,
        _hasBody: true,
        _trailer: '',
        finished: true,
        agent: [Object],
        socketPath: undefined,
        method: 'GET',
        path: '/',
        _headers: [Object],
        _headerNames: [Object],
        _header: 'GET / HTTP/1.1\r\nHost: localhost:38337\r\nConnection: keep-alive\r\n\r\n',
        _headerSent: true,
        emit: [Function: logEvent],
        socket: [Circular],
        connection: [Circular],
        parser: [Object],
        res: [Circular] },
     ondata: [Function: socketOnData],
     onend: [Function: socketOnEnd],
     _peername: { address: '127.0.0.1', family: 'IPv4', port: 38337 },
     _connectQueue: null,
     readable: true },
  httpVersionMajor: 1,
  httpVersionMinor: 1,
  upgrade: false }
*/
	//require('haraldutil').p(response)
	httpServer.close()
}

function closeListener() {
	log('Server close event')
}

function logEvents(emitter, slogan) {
	var emit = emitter.emit
	if (typeof emit === 'function') {
		emitter.emit = logEvent
	} else throw new Error('Not emitter')
	return unwrap

	function logEvent(e) {
		var args = Array.prototype.slice.call(arguments)

		var logArgs = args.slice()
		logArgs.forEach(shortenObjects)
		logArgs.unshift(slogan)
		logArgs.unshift(require('haraldutil').ps())
		log.apply(this, logArgs)

		emit.apply(emitter, args)
	}
	function unwrap() {
		emitter.emit = emit
	}
}

function shortenObjects(object, index, array) {
	var result

	if (object instanceof net.Socket) result = 'socket: ' + getSocketAddress(object)
	else if (object instanceof http.IncomingMessage) {
		result = object.statusCode == null ?
			'request: ' + getRequestDescription(object) :
			'clientResponse: ' + object.statusCode
	} else if (object instanceof http.ServerResponse) result = 'response: ' + getResponseAddress(object)

	if (result) array[index] = result
}

/*
Get listening information
server: http.Server or net.Server
return value: string interface:port
*/
function getServerAddress(server) {
	var address = server.address()
	return (address.address !== '0.0.0.0' ? address.address : 'any') + ':' + address.port
}

/*
Get port information
server: http.Server or net.Server
return value: number port, 0 if not listening
*/
function getServerPort(server) {
	var address = server.address()
	return address ? address.port : 0
}

/*
Get the remote address the socket connects to
socket: net.Socket
return value: string: ip:port
*/
function getSocketAddress(socket) {
	return socket.remoteAddress + ':' + socket.remotePort
}

/*
Get response description
response: http.ServerResponse
return value: printable remote address
*/
function getResponseAddress(response) {
	var socket = response.socket
	return socket ? getSocketAddress(socket) : '?'
}

/*
Get request description
request: http.IncomingMessage
return value: printable remote address
*/
function getRequestDescription(request) {
	return request.url + ' ' + getRequestAddress(request)
}

/*
Get request remote address
request: http.IncomingMessage
return value: printable remote address
*/
function getRequestAddress(request) {
	var socket = request.socket
	return socket ? getSocketAddress(socket) : '?'
}

function obsolete1(request) {
	// to find how this server was addressed
	// .headers.host if filled in by client
	// .headers.x-forwarded-for, x-forwarded-port if via proxy
	// .connection.socket.remoteAddress or .socket.remoteAddress
	// if host header is missing, you do not know how the receiving server was addressed
	var host = request.headers && request.headers.host
	var proto = request.headers && request.headers['x-forwarded-proto']
	console.log('server address: ',
		' request.header.host:', inspect(host),
		' request.headers[\'x-forwarded-proto\']:', inspect(proto))
}

function obsolete2(request) {
		// to find client information
	var source = request.connection &&
		request.connection.socket && 'request.connection.socket' ||
		request.socket && 'request.socket'
	var socket = request.connection &&
		request.connection.socket ||
		request.socket
	var forward = request.headers && request.headers['x-forwarded-for']
	console.log('Client data: source:', source,
		' socket.remoteAddress:', inspect(socket.remoteAddress),
		' socket.remotePort:', inspect(socket.remotePort),
		'request.headers[\'x-forwarded-for\']:', inspect(forward))

	// ip string
	var ip = socket ? socket.remoteAddress : 'unknown ip'
	// port number
	var port = socket ? socket.remotePort : 'unknown port'
	console.log('request from %s:%s', ip, port)
}
