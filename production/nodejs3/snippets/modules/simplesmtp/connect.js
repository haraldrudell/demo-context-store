// connect.js
// Demonstrate simplesmtp.connect
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

/*
simplesmtp.connect(port, host, options) connects to the smtp server on nextTick.
'idle' is emitted after about 1.5 s if everything works
'error' is propagated from the socket
for a blocked port, connect hangs for over 60 s

close()
does socket.end()
may cause errors due to ongoing connect commands
*/

var simplesmtp = require('simplesmtp') // https://github.com/andris9/simplesmtp

var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html
var path = require('path') // http://nodejs.org/api/path.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var jsonKey = 'snippets-modules-simplesmtp-connect'
var jsonFilename = path.join(haraldutil.getHomeFolder(), 'apps', 'nodejs3.json')
var json = require(jsonFilename)[jsonKey]
if (!json) throw new Error('File: ' + jsonFilename + ' key: ' + jsonKey + ' missing.')

/*
Stream mail

connect:48:streamMessage invoking connect at: 2013-08-28T10:29:50.795Z
connect:53:streamMessage MailSender options: { host: 'smtp.gmail.com',
  port: 465,
  secureConnection: true,
  debug: true,
  auth: { user: 'vaktparad@gmail.com', pass: 'xxx' } }
SERVER:
└──220 mx.google.com ESMTP xn12sm32977913pac.12 - gsmtp
CLIENT:
└──EHLO [127.0.0.1]
SERVER:
└──250-mx.google.com at your service, [24.130.142.64]
   250-SIZE 35882577
   250-8BITMIME
   250-AUTH LOGIN PLAIN XOAUTH XOAUTH2 PLAIN-CLIENTTOKEN
   250 ENHANCEDSTATUSCODES
CLIENT:
└──AUTH PLAIN AHZha3RwYXJhZEBnbWFpbC5jb20AZ29ydWRlbGw=
SERVER:
└──235 2.7.0 Accepted
client idle
connect:62:getEnvelope 0.374 sending envelope
connect:64:getEnvelope Envelope options: { from: 'nodejs3', to: [ 'harald@therudells.com' ] }
CLIENT:
└──MAIL FROM:<nodejs3>
SERVER:
└──250 2.1.0 OK xn12sm32977913pac.12 - gsmtp
CLIENT:
└──RCPT TO:<harald@therudells.com>
SERVER:
└──250 2.1.5 OK xn12sm32977913pac.12 - gsmtp
client rcptFailed 0[...]
connect:71:emitWarning 0.456 got rcptFailed
CLIENT:
└──DATA
SERVER:
└──354  Go ahead xn12sm32977913pac.12 - gsmtp
client message
connect:76:sendMessage 0.927 streaming message
client pipe object:MessageStream {...}
CLIENT (DATA):
└──To: harald@therudells.com
   Subject: test-to-gmail@c505

   Body Text
SERVER:
└──250 2.0.0 OK 1377685792 xn12sm32977913pac.12 - gsmtp
client ready true '250 2.0.0 OK 1377685...'
connect:83:resultListener 1.394 smtp reponse: success 250 2.0.0 OK 1377685792 xn12sm32977913pac.12 - gsmtp
client idle
connect:93:closeClient 1.398 invoking close
Closing connection to the server
socket finish
client end
socket close false
socket end
connect:101:end 1.436 end
*/
function MessageStream() {
	stream.Readable.call(this)
	this._read = _read

	function _read(n) {
		this.push('To: harald@therudells.com\n' +
			'Subject: test-to-gmail@c505\n' +
			'\n' +
			'Body Text\n')
		this.push(null)
	}
}
util.inherits(MessageStream, stream.Readable)

streamMessage()
function streamMessage() {
	var t0 = Date.now()
	require('haraldutil').p('invoking connect at:', new Date(t0).toISOString())

	var options = json.connect
	var printable = haraldutil.clone(options)
	if (printable.auth && printable.auth.pass) printable.auth.pass = 'xxx'
	require('haraldutil').p('MailSender options:', printable)

	var smtpClient = simplesmtp.connect(options.port, options.host, options)
		.once('idle', getEnvelope)
		.on('error', ErrorListener)
	var unwrap = wrapEmit(smtpClient, 'client')
	var unwrap2

	function getEnvelope() {
		require('haraldutil').p(String((Date.now() - t0) / 1e3), 'sending envelope')
		var options = json.envelope
		require('haraldutil').p('Envelope options:', options)
		smtpClient.once('message', sendMessage)
		smtpClient.once('rcptFailed', emitWarning)
		smtpClient.useEnvelope(options)
	}

	function emitWarning(recipients) {
		require('haraldutil').p(String((Date.now() - t0) / 1e3), 'got rcptFailed')
		if (Array.isArray(recipients) && recipients.length) throw new Error('Failing recipients:' + recipients)
	}

	function sendMessage() {
		require('haraldutil').p(String((Date.now() - t0) / 1e3), 'streaming message')
		smtpClient.once('ready', resultListener)
		smtpClient.once('idle', closeClient)
		new MessageStream().pipe(smtpClient)
	}

	function resultListener(value, str) {
		require('haraldutil').p(String((Date.now() - t0) / 1e3), 'smtp reponse:',
			value ? 'success' : 'failure',
			str)
	}

	function ErrorListener(err) {
		require('haraldutil').pp(String((Date.now() - t0) / 1e3), 'error', err)
	}

	function closeClient() {
		require('haraldutil').p(String((Date.now() - t0) / 1e3), 'invoking close')
		if (smtpClient.socket) smtpClient.socket.once('end', end)
		else smtpClient.once('end', end)
		var wrapper = wrapEmit(smtpClient.socket, 'socket')
		smtpClient.close()
	}

	function end() {
		require('haraldutil').p(String((Date.now() - t0) / 1e3), 'end')
	}
}

/*
protocol, ports and hosts
smtp goes over tcp port 25
smtp over ssl is port 587 and earlier 465

We use smtp, not imap or pop

Gmail supports ports 25, 465 and 587
Gmail host name is aspmx.l.google.com

comcast blocks port 25
foxyboy@c505:~/Desktop/c505/node/nodejs3$ telnet aspmx.l.google.com 25
Trying 74.125.25.26...
^C

fasenode@cloud1:~$ telnet aspmx.l.google.com 25
Trying 2607:f8b0:400e:c03::1b...
Connected to aspmx.l.google.com.
Escape character is '^]'.
220 mx.google.com ESMTP hb3si19402846pac.326 - gsmtp
quit
221 2.0.0 closing connection hb3si19402846pac.326 - gsmtp
Connection closed by foreign host.
/*
simplesmtp.connect(port, host, options)
port: integer, default 25 or 465
host: string, default 'localhost'
options: object
.auth: user pass
.debug

*/
//testConnect()
function testConnect() {
	var t0 = Date.now()
	require('haraldutil').p('connect at:', new Date(t0).toISOString())
	var smtpClient = simplesmtp.connect(465, 'smtp.gmail.com', {debug: true, secureConnection: true})
		.once('idle', closeClient)
		.on('error', ErrorListener)
	var unwrap = wrapEmit(smtpClient, 'client')
	var unwrap2

	function ErrorListener(err) {
		require('haraldutil').pp(Date.now() - t0, 'error', err)
	}

	function closeClient() {
		require('haraldutil').p('connected at', (Date.now() - t0) / 1e3, 'invoking close')
		if (smtpClient.socket) smtpClient.socket.once('end', end)
		else smtpClient.once('end', end)
		var wrapper = wrapEmit(smtpClient.socket, 'socket')
		smtpClient.close()
	}

	function end() {
		require('haraldutil').p('end at', (Date.now() - t0) / 1e3)
	}
}

/*
Get the internal socket

connect only initializes the object.
However, on nextTick, simplesmtp does .connect()
at the net.connect() call:
'connection' is _onConnect
'error' is _onError

errors on the socket are propagated on the smtpClient

connect() sets .socket to net.connect()

client.close() abruptly closes the socket.
it does socket.end() which disables writing to the socket

connect:89:getSocket got socket
Closing connection to the server
connect:100:ErrorListener 'error' object:Error {
  code: 'ECONNRESET',
  sslError: undefined,
  (nonE)(get)stack: Error: socket hang up,
      at SecurePair.error (tls.js:990:23),
      at EncryptedStream.CryptoStream._done (tls.js:686:22),
      at EncryptedStream.read [as _read] (tls.js:486:12),
      at EncryptedStream.Readable.read (_stream_readable.js:320:10),
      at CleartextStream.onCryptoStreamFinish (tls.js:301:47),
      at CleartextStream.g (events.js:175:14),
      at CleartextStream.EventEmitter.emit (events.js:92:17),
      at finishMaybe (_stream_writable.js:352:12),
      at endWritable (_stream_writable.js:359:3),
      at CleartextStream.Writable.end (_stream_writable.js:337:5),
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'socket hang up',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}
Closing connection to the server

*/
//getInternalSocket()
function getInternalSocket() {
	var smtpClient = simplesmtp.connect(465, 'smtp.gmail.com', {debug: true, secureConnection: true})
		.on('error', ErrorListener)
	process.nextTick(getSocket)

	function getSocket() {
		var socket = smtpClient.socket
		if (socket) require('haraldutil').p('got socket')
		else require('haraldutil').p('simplesmtp had no socket')

		closeClient()
	}

	function closeClient() {
		smtpClient.close()
	}

	function ErrorListener(err) {
		require('haraldutil').pp('error', err)
	}
}

/*
smtp over port 25
blocked behavior: Error emitted after 63 s
simplesmtp closes automatically and emits 'end'

Comcast blocks port 25

connect:79:smtp25 2013-08-28T07:35:12.678Z
client error object:Error {...}
connect:86:ErrorListener 63143 'error' object:Error {
  code: 'ETIMEDOUT',
  errno: 'ETIMEDOUT',
  syscall: 'connect',
  (nonE)(get)stack: Error: connect ETIMEDOUT,
      at errnoException (net.js:900:11),
      at Object.afterConnect [as oncomplete] (net.js:891:19),
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'connect ETIMEDOUT',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}
Closing connection to the server
client end
*/
//smtp25()
function smtp25() {
	require('haraldutil').p(new Date().toISOString())
	var t0 = Date.now()
	var smtpClient = simplesmtp.connect(25, 'aspmx.l.google.com', {debug: true})
		.on('error', ErrorListener)
	var unwrap = wrapEmit(smtpClient, 'client')

	function ErrorListener(err) {
		require('haraldutil').pp(Date.now() - t0, 'error', err)
	}
}
/*
smtpCLient object
extends Stream EventEmitter

connect:16 object:SMTPClient {
  domain: null,
  _events: {},
  _maxListeners: 10,
  writable: true,
  readable: true,
  options: {
    debug: true,
    secureConnection: false,
    auth: false,
    maxConnections: 5,
    name: '[127.0.0.1]'
  },
  port: 25,
  host: 'aspmx.l.google.com',
  _secureMode: false,
  _ignoreData: false,
  _remainder: '',
  destroyed: false,
  socket: false,
  _supportedAuth: 0[(nonE)length: 0],
  _dataMode: false,
  _lastDataBytes: object:Buffer {
    0: 0,
    1: 0,
    length: 2,
    parent: object:SlowBuffer {
      0: 118,
      1: 97,
      2: 114,
      3: 32,
      4: 83,
      5: 116,
      6: 114,
      7: 101,
      8: 97,
      9: 109,
      ...,
      8191: 0,
      length: 8192,
      used: 7312
    },
    offset: 6128
  },
  _currentAction: false,
  _greetingTimeout: false,
  _xoauth2: false,
  -- prototype: SMTPClient,
  _init: function:0,
  connect: function:0,
  _upgradeConnection: function:1,
  _onConnect: function:0,
  _destroy: function:0,
  _onData: function:1,
  _onError: function:3,
  _onClose: function:0,
  _onEnd: function:0,
  _onTimeout: function:0,
  write: function:1,
  end: function:1,
  sendCommand: function:1,
  quit: function:0,
  close: function:0,
  useEnvelope: function:1,
  _authenticateUser: function:0,
  _actionGreeting: function:1,
  _actionEHLO: function:1,
  _actionHELO: function:1,
  _actionSTARTTLS: function:1,
  _actionAUTH_LOGIN_USER: function:1,
  _actionAUTH_CRAM_MD5: function (str),
  _actionAUTH_CRAM_MD5_PASS: function (str),
  _actionAUTH_LOGIN_PASS: function:1,
  _actionAUTHComplete: function:1,
  _actionXOAUTHRetry: function:1,
  _actionIdle: function:1,
  _actionMAIL: function:1,
  _actionRCPT: function:1,
  _actionDATA: function:1,
  _actionStream: function:1,
  log: function (str),
  -- prototype: Stream,
  pipe: function (dest, options),
  -- prototype: EventEmitter,
  setMaxListeners: function (n),
  emit: function (type),
  addListener: function (type, listener),
  on: recursive-object#43,
  once: function (type, listener),
  removeListener: function (type, listener),
  removeAllListeners: function (type),
  listeners: function (type)
}
*/
//require('haraldutil').pp(smtpClient)

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
