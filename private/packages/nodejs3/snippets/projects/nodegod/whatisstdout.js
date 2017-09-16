// whatisstdout.js

// http://nodejs.org/api/child_process.html
var child_process = require('child_process')
// http://nodejs.org/api/path.html
var path = require('path')

/*
stdout of a node process is:
instance of WriteStream based on Socket, Stream, EventEmitter based on WriteStream based on EventEmitter

process.stdout does not emit 'data' events

whatisstdout:7 object:WriteStream {
  allowHalfOpen: undefined,
  _handle: object:TTY {
    onread: function onread(buffer, offset, length),
    writeQueueSize: 0,
    owner: recursive-object#1,
    -- prototype: TTY,
    writeAsciiString: function writeAsciiString(),
    readStart: function readStart(),
    writeBuffer: function writeBuffer(),
    writeUcs2String: function writeUcs2String(),
    close: function close(),
    getWindowSize: function getWindowSize(),
    unref: function unref(),
    setRawMode: function setRawMode(),
    writeUtf8String: function writeUtf8String(),
    readStop: function readStop()
  },
  readable: false,
  fd: 1,
  _flags: 0,
  destroyed: false,
  destroySoon: function (er),
  rows: 24,
  columns: 124,
  bytesRead: 0,
  _isStdio: true,
  writable: true,
  _connectQueueSize: 0,
  _type: 'tty',
  destroy: recursive-object#14,
  _bytesDispatched: 0,
  _pendingWriteReqs: 0,
  errorEmitted: false,
  -- prototype: WriteStream,
  clearScreenDown: function (),
  cursorTo: function (x, y),
  moveCursor: function (dx, dy),
  _refreshSize: function (),
  getWindowSize: function (),
  isTTY: true,
  clearLine: function (dir),
  -- prototype: Socket,
  destroySoon: function (),
  destroy: function (exception),
  address: function (),
  (get)remotePort: undefined,
  (nonE)(get)bufferSize: undefined,
  end: function (data, encoding),
  (get)remoteAddress: undefined,
  listen: function (),
  write: function (data, arg1, arg2),
  connect: function (options, cb),
  _destroy: function (exception, cb),
  pause: function (),
  (get)bytesWritten: undefined,
  _onTimeout: function (),
  _write: function (data, encoding, cb),
  (nonE)(get)readyState: 'closed',
  setNoDelay: function (enable),
  _getpeername: function (),
  setKeepAlive: function (setting, msecs),
  setTimeout: function (msecs, callback),
  resume: function (),
  _connectQueueCleanUp: function (exception),
  setEncoding: function (encoding),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  removeListener: function (type, listener),
  addListener: function (type, listener),
  listeners: function (type),
  emit: function (),
  on: recursive-object#41,
  once: function (type, listener),
  setMaxListeners: function (n),
  removeAllListeners: function (type)
}
*/
//require('haraldutil').pp(process.stdout)

process.stdout.once('data', function () {console.log('DATA')})
// data
// - but no DATA
console.log('data')

var child = child_process.spawn('node', [path.join(__dirname, 'child10s')])
/*
stdout for a child is Socket based on Stream, eventEmitter

whatisstdout:100 object:Socket {
  allowHalfOpen: undefined,
  _handle: object:Pipe {
    onread: function onread(buffer, offset, length),
    writeQueueSize: 0,
    owner: recursive-object#1,
    -- prototype: Pipe,
    writeAsciiString: function writeAsciiString(),
    listen: function listen(),
    connect: function connect(),
    readStart: function readStart(),
    writeBuffer: function writeBuffer(),
    shutdown: function shutdown(),
    writeUcs2String: function writeUcs2String(),
    close: function close(),
    unref: function unref(),
    writeUtf8String: function writeUtf8String(),
    readStop: function readStop(),
    bind: function bind(),
    open: function open()
  },
  readable: true,
  _paused: false,
  _flags: 0,
  destroyed: false,
  bytesRead: 0,
  writable: false,
  _events: {
    close: function ()
  },
  _connectQueueSize: 0,
  _bytesDispatched: 0,
  _pendingWriteReqs: 0,
  errorEmitted: false,
  -- prototype: Socket,
  address: function (),
  (get)remotePort: undefined,
  (nonE)(get)bufferSize: undefined,
  end: function (data, encoding),
  (get)remoteAddress: undefined,
  listen: function (),
  write: function (data, arg1, arg2),
  connect: function (options, cb),
  _destroy: function (exception, cb),
  pause: function (),
  (get)bytesWritten: undefined,
  destroySoon: function (),
  _onTimeout: function (),
  _write: function (data, encoding, cb),
  (nonE)(get)readyState: 'closed',
  setNoDelay: function (enable),
  _getpeername: function (),
  setKeepAlive: function (setting, msecs),
  setTimeout: function (msecs, callback),
  resume: function (),
  _connectQueueCleanUp: function (exception),
  destroy: function (exception),
  setEncoding: function (encoding),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  removeListener: function (type, listener),
  addListener: function (type, listener),
  listeners: function (type),
  emit: function (),
  on: recursive-object#39,
  once: function (type, listener),
  setMaxListeners: function (n),
  removeAllListeners: function (type)
}
*/
//require('haraldutil').pp(child.stdout)
child.stdout.on('data', function () {console.log('CHILDDATA')})