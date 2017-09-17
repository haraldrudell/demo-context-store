// child_process-childprocess.js
// Demonstrate Node.js api
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var child_process = require('child_process') // http://nodejs.org/api/child_process.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

/*
child_process:99 object:ChildProcess {
  domain: null,
  _events: {},
  _maxListeners: undefined,
  _closesNeeded: 3,
  _closesGot: 0,
  connected: false,
  signalCode: null,
  exitCode: null,
  killed: false,
  _handle: object:Process {
    owner: recursive-object#1,
    onexit: function (exitCode, signalCode),
    pid: 17857,
    -- prototype: Process,
    close: function (),
    spawn: function (),
    kill: function (),
    ref: function (),
    unref: function ()
  },
  pid: 17857,
  stdin: object:Socket {
    _connecting: false,
    _hadError: false,
    _handle: object:Pipe {
      fd: 12,
      writeQueueSize: 0,
      owner: recursive-object#10,
      onread: function onread(nread, buffer),
      reading: true,
      -- prototype: Pipe,
      close: function (),
      unref: function (),
      ref: function (),
      readStart: function (),
      readStop: function (),
      shutdown: function (),
      writeBuffer: function (),
      writeAsciiString: function (),
      writeUtf8String: function (),
      writeUcs2String: function (),
      bind: function (),
      listen: function (),
      connect: function (),
      open: function ()
    },
    _readableState: object:ReadableState {
      highWaterMark: 16384,
      buffer: 0[(nonE)length: 0],
      length: 0,
      pipes: null,
      pipesCount: 0,
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: true,
      sync: false,
      needReadable: true,
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
    _maxListeners: undefined,
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
      corked: 0,
      sync: true,
      bufferProcessing: false,
      onwrite: function (er),
      writecb: null,
      writelen: 0,
      buffer: 0[(nonE)length: 0],
      pendingcb: 0,
      prefinished: false,
      -- prototype: WritableState
    },
    writable: true,
    allowHalfOpen: false,
    destroyed: false,
    errorEmitted: false,
    bytesRead: 0,
    _bytesDispatched: 0,
    _writev: null,
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
    _writeGeneric: function (writev, data, encoding, cb),
    _writev: function (chunks, cb),
    _write: function (data, encoding, cb),
    (get)bytesWritten: [getter Exception:TypeError: Cannot read property 'buffer' of undefined],
    connect: function (options, cb),
    ref: function (),
    unref: function (),
    (nonE)(get)readyState: 'closed',
    (nonE)(get)bufferSize: undefined,
    -- prototype: Duplex,
    write: function (chunk, encoding, cb),
    cork: function (),
    uncork: function (),
    _write: function (chunk, encoding, cb),
    _writev: null,
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
    addListener: recursive-object#70,
    resume: function (),
    pause: function (),
    wrap: function (stream),
    -- prototype: Stream,
    pipe: function (dest, options),
    -- prototype: EventEmitter,
    domain: undefined,
    _events: undefined,
    _maxListeners: undefined,
    setMaxListeners: function (n),
    emit: function (type),
    addListener: function (type, listener),
    on: recursive-object#77,
    once: function (type, listener),
    removeListener: function (type, listener),
    removeAllListeners: function (type),
    listeners: function (type)
  },
  stdout: object:Socket {
    _connecting: false,
    _hadError: false,
    _handle: object:Pipe {
      fd: 16,
      writeQueueSize: 0,
      owner: recursive-object#82,
      onread: recursive-object#12,
      reading: true,
      -- prototype: Pipe,
      close: recursive-object#13,
      unref: recursive-object#14,
      ref: recursive-object#15,
      readStart: recursive-object#16,
      readStop: recursive-object#17,
      shutdown: recursive-object#18,
      writeBuffer: recursive-object#19,
      writeAsciiString: recursive-object#20,
      writeUtf8String: recursive-object#21,
      writeUcs2String: recursive-object#22,
      bind: recursive-object#23,
      listen: recursive-object#24,
      connect: recursive-object#25,
      open: recursive-object#26
    },
    _readableState: object:ReadableState {
      highWaterMark: 16384,
      buffer: 0[(nonE)length: 0],
      length: 0,
      pipes: null,
      pipesCount: 0,
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: true,
      sync: false,
      needReadable: true,
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
    readable: true,
    domain: null,
    _events: {
      end: function g() {
        listener: recursive-object#31
      },
      finish: recursive-object#32,
      _socketEnd: recursive-object#33,
      close: function ()
    },
    _maxListeners: undefined,
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
      corked: 0,
      sync: true,
      bufferProcessing: false,
      onwrite: function (er),
      writecb: null,
      writelen: 0,
      buffer: 0[(nonE)length: 0],
      pendingcb: 0,
      prefinished: false,
      -- prototype: WritableState
    },
    writable: false,
    allowHalfOpen: false,
    destroyed: false,
    errorEmitted: false,
    bytesRead: 0,
    _bytesDispatched: 0,
    _writev: null,
    _pendingData: null,
    _pendingEncoding: '',
    -- prototype: Socket,
    read: recursive-object#37,
    listen: recursive-object#38,
    setTimeout: recursive-object#39,
    _onTimeout: recursive-object#40,
    setNoDelay: recursive-object#41,
    setKeepAlive: recursive-object#42,
    address: recursive-object#43,
    _read: recursive-object#44,
    end: recursive-object#45,
    destroySoon: recursive-object#46,
    _destroy: recursive-object#47,
    destroy: recursive-object#48,
    _getpeername: recursive-object#49,
    (get)remoteAddress: undefined,
    (get)remotePort: undefined,
    _getsockname: recursive-object#50,
    (get)localAddress: undefined,
    (get)localPort: undefined,
    write: recursive-object#51,
    _writeGeneric: recursive-object#52,
    _writev: recursive-object#53,
    _write: recursive-object#54,
    (get)bytesWritten: [getter Exception:TypeError: Cannot read property 'buffer' of undefined],
    connect: recursive-object#55,
    ref: recursive-object#56,
    unref: recursive-object#57,
    (nonE)(get)readyState: 'closed',
    (nonE)(get)bufferSize: undefined,
    -- prototype: Duplex,
    write: recursive-object#58,
    cork: recursive-object#59,
    uncork: recursive-object#60,
    _write: recursive-object#61,
    _writev: null,
    end: recursive-object#62,
    -- prototype: Readable,
    push: recursive-object#63,
    unshift: recursive-object#64,
    setEncoding: recursive-object#65,
    read: recursive-object#66,
    _read: recursive-object#67,
    pipe: recursive-object#68,
    unpipe: recursive-object#69,
    on: recursive-object#70,
    addListener: recursive-object#70,
    resume: recursive-object#71,
    pause: recursive-object#72,
    wrap: recursive-object#73,
    -- prototype: Stream,
    pipe: recursive-object#74,
    -- prototype: EventEmitter,
    domain: undefined,
    _events: undefined,
    _maxListeners: undefined,
    setMaxListeners: recursive-object#75,
    emit: recursive-object#76,
    addListener: recursive-object#77,
    on: recursive-object#77,
    once: recursive-object#78,
    removeListener: recursive-object#79,
    removeAllListeners: recursive-object#80,
    listeners: recursive-object#81
  },
  stderr: object:Socket {
    _connecting: false,
    _hadError: false,
    _handle: object:Pipe {
      fd: 18,
      writeQueueSize: 0,
      owner: recursive-object#92,
      onread: recursive-object#12,
      reading: true,
      -- prototype: Pipe,
      close: recursive-object#13,
      unref: recursive-object#14,
      ref: recursive-object#15,
      readStart: recursive-object#16,
      readStop: recursive-object#17,
      shutdown: recursive-object#18,
      writeBuffer: recursive-object#19,
      writeAsciiString: recursive-object#20,
      writeUtf8String: recursive-object#21,
      writeUcs2String: recursive-object#22,
      bind: recursive-object#23,
      listen: recursive-object#24,
      connect: recursive-object#25,
      open: recursive-object#26
    },
    _readableState: object:ReadableState {
      highWaterMark: 16384,
      buffer: 0[(nonE)length: 0],
      length: 0,
      pipes: null,
      pipesCount: 0,
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: true,
      sync: false,
      needReadable: true,
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
    readable: true,
    domain: null,
    _events: {
      end: function g() {
        listener: recursive-object#31
      },
      finish: recursive-object#32,
      _socketEnd: recursive-object#33,
      close: function ()
    },
    _maxListeners: undefined,
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
      corked: 0,
      sync: true,
      bufferProcessing: false,
      onwrite: function (er),
      writecb: null,
      writelen: 0,
      buffer: 0[(nonE)length: 0],
      pendingcb: 0,
      prefinished: false,
      -- prototype: WritableState
    },
    writable: false,
    allowHalfOpen: false,
    destroyed: false,
    errorEmitted: false,
    bytesRead: 0,
    _bytesDispatched: 0,
    _writev: null,
    _pendingData: null,
    _pendingEncoding: '',
    -- prototype: Socket,
    read: recursive-object#37,
    listen: recursive-object#38,
    setTimeout: recursive-object#39,
    _onTimeout: recursive-object#40,
    setNoDelay: recursive-object#41,
    setKeepAlive: recursive-object#42,
    address: recursive-object#43,
    _read: recursive-object#44,
    end: recursive-object#45,
    destroySoon: recursive-object#46,
    _destroy: recursive-object#47,
    destroy: recursive-object#48,
    _getpeername: recursive-object#49,
    (get)remoteAddress: undefined,
    (get)remotePort: undefined,
    _getsockname: recursive-object#50,
    (get)localAddress: undefined,
    (get)localPort: undefined,
    write: recursive-object#51,
    _writeGeneric: recursive-object#52,
    _writev: recursive-object#53,
    _write: recursive-object#54,
    (get)bytesWritten: [getter Exception:TypeError: Cannot read property 'buffer' of undefined],
    connect: recursive-object#55,
    ref: recursive-object#56,
    unref: recursive-object#57,
    (nonE)(get)readyState: 'closed',
    (nonE)(get)bufferSize: undefined,
    -- prototype: Duplex,
    write: recursive-object#58,
    cork: recursive-object#59,
    uncork: recursive-object#60,
    _write: recursive-object#61,
    _writev: null,
    end: recursive-object#62,
    -- prototype: Readable,
    push: recursive-object#63,
    unshift: recursive-object#64,
    setEncoding: recursive-object#65,
    read: recursive-object#66,
    _read: recursive-object#67,
    pipe: recursive-object#68,
    unpipe: recursive-object#69,
    on: recursive-object#70,
    addListener: recursive-object#70,
    resume: recursive-object#71,
    pause: recursive-object#72,
    wrap: recursive-object#73,
    -- prototype: Stream,
    pipe: recursive-object#74,
    -- prototype: EventEmitter,
    domain: undefined,
    _events: undefined,
    _maxListeners: undefined,
    setMaxListeners: recursive-object#75,
    emit: recursive-object#76,
    addListener: recursive-object#77,
    on: recursive-object#77,
    once: recursive-object#78,
    removeListener: recursive-object#79,
    removeAllListeners: recursive-object#80,
    listeners: recursive-object#81
  },
  stdio: 3[recursive-object#10, recursive-object#82, recursive-object#92, (nonE)length: 3],
  -- prototype: ChildProcess,
  spawn: function (options),
  kill: function (sig),
  ref: function (),
  unref: function (),
  -- prototype: EventEmitter,
  domain: undefined,
  _events: undefined,
  _maxListeners: undefined,
  setMaxListeners: recursive-object#75,
  emit: recursive-object#76,
  addListener: recursive-object#77,
  on: recursive-object#77,
  once: recursive-object#78,
  removeListener: recursive-object#79,
  removeAllListeners: recursive-object#80,
  listeners: recursive-object#81
}
*/
//require('haraldutil').pp(child_process.spawn('node'))