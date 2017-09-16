// server.js
// Demonstrate simplesmtp.createServer
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

var nodemailer = require('nodemailer') // https://github.com/andris9/nodemailer
var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html
var path = require('path') // http://nodejs.org/api/path.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil
var log = haraldutil.p

var jsonKey = 'snippets-modules-simplesmtp-server'
var jsonFilename = path.join(haraldutil.getHomeFolder(), 'apps', 'nodejs3.json')
var json = require(jsonFilename)[jsonKey]
if (!json) throw new Error('File: ' + jsonFilename + ' key: ' + jsonKey + ' missing.')

function StringWriter(str) {
	var self = this
	stream.Writable.call(this, {encoding: 'utf8'})
	this._write = _write

	function _write(data, encoding, cb) {
		str[0] += encoding !== 'buffer' ? data : String(data)
		cb()
	}
}
util.inherits(StringWriter, stream.Writable)


/*
createServer(options)
options: object
.debug: boolean, default false: debug printouts
.name: string server name
.timeout: ms, default 60 s
secureConnection, SMTPBanner, requireAuthentication, enableAuthentication
maxSize, credentials, authMethods, disableEHLO, ignoreTLS, disableDNSValidation

return value: SMTPServer

listen prevents node from exiting

simplesmtp.createServer(options)
options: object
.name, .debug, .timeout, .secureConnection, .SMTPBanner, .requireAuthentication
.enableAuthentication, .maxSize (not enforced), .credentials, .authMethods, .disableEHLO
.ignoreTLS, disableDNSValidation

return value: server.SMTPServer
.SMTPServer: RAIServer issuing 'connect', 'error', has ._server net.Server
.options property
.end(cb) - must have callback
.listen(port, host, callback(err))
For each email events: startData, data, dataReady, close

events:
'validateRecipient' envelope mailbox cb(err)
'startData' envelope
'data' envelope Buffer
'dataReady' envelope, cb(err, code): err.message is returned to mailserver, code is message id
'close' envelope

envelope is an Object object
.from: string
.to: array of string
.date Date
.remoteAddress: string
.authentication: object
.host: string host ip in square brackets
email: string mailbox eg. 'user@domain.tld'
*/
create()
function create() {
	var options = json.createServer
	require('haraldutil').p('createServer options:', options)

	var smtpServer = simplesmtp.createServer(options)
	var unwrap = wrapEmit(smtpServer, 'server')

	var raiServer = smtpServer.SMTPServer
	var unwrap2 = wrapEmit(raiServer, 'rai')

	var netServer = raiServer._server
	var unwrap3 = wrapEmit(netServer, 'net')

	var cbCounter = 3

	smtpServer.on('senderValidationFailed', senderValidationFailedListener)
	smtpServer.on('startData', startDataListener)
	smtpServer.on('data', dataListener)
	smtpServer.on('dataReady', dataReadyListener)
	smtpServer.on('close', closeListener)

	require('haraldutil').p('listen options: port:', json.port, 'host:', json.host)
	smtpServer.listen(json.port, json.host, connectToServer)

	var result = ['']

	function connectToServer(err) {
		if (err) throw err

		var port = getPort(smtpServer)
		require('haraldutil').p('listening on port:', port)

		sendMailToPort(port, sendResult)
	}

	/*
	'senderValidationFailed'
	this: SMTPServer
	senderMailbox: string

	DNS validation is based on the FROM in the envelope.
	nodemailer by default uses: anonymous@[127.0.0.1]
	*/
	function senderValidationFailedListener(senderMailbox) {
		throw new Error('DNS validation failed for sender:', senderMailbox)
	}

	/*
	'startData'
	this: SMTPServer
	envelope:object
	.from: 'anonymous@[127.0.0.1]'
	.to: ['TO@domain']
	.date: 2013-08-28T15:28:45.970Z
	.remoteAddress: '127.0.0.1'
	.authentication: {username: false, authenticated: false, state: 'NORMAL'}
	.host: '[127.0.0.1]'
	*/
	function startDataListener(envelope) {
		envelope.saveStream = new StringWriter(result)
			.once('finish', done)
			.on('error', streamError)
	}

	function dataListener(envelope, chunk) {
		envelope.saveStream.write(chunk)
	}

	function dataReadyListener(envelope, callback) {
		envelope.saveStream.end(callback)
	}

	/*
	Close of conenction
	*/
	function closeListener(envelope) {
		smtpServer.end(endResult) // listens to 'close'
	}

	function endResult() {
		require('haraldutil').pargs(arguments)

		done(null, 'receive')
	}

	function streamError(err) {
		log(STREAMERROR)
		throw err
	}

	function sendResult(err, success) {
		if (success) {

			if (Array.isArray(success.failedRecipients) && success.failedRecipients.length)
				log('Failed recipients:', success.failedRecipients)
		}
		if (err) {
			log('SENDFAILED')
			throw err
		}
		done(null, 'send')
	}

	function done(err, slogan) {
		require('haraldutil').p(slogan || '?')
		if (!--cbCounter) {
			log('DONE')
			require('haraldutil').p('chars:', result[0].length)
		}
	}

	/*
	server:203:getPort {
	  address: '0.0.0.0',
	  family: 'IPv4',
	  port: 36410
	}
	*/
	function getPort(smtpServer) {
		var result
		var address = smtpServer && smtpServer.SMTPServer && smtpServer.SMTPServer._server &&
			smtpServer.SMTPServer._server.address()
		//require('haraldutil').pp(address)
		if (address && address.port) result = address.port

		return result
	}
}

function sendMailToPort(port, cb) {
	var transport
	var invocation = new Error(arguments.callee.name)

	connectAndSend()

	function connectAndSend() {
		transport = nodemailer.createTransport('SMTP', {port: port})
		if (!transport.transport) cb(new Error('nodemailer create transport failed'))

		transport.sendMail({
			from: 'FROM',
			to: ['TO@domain'], // to must be mailbox syntax
			subject: 'SUBJECT',
			body: 'BODY'
		}, sendResult)
	}

	function sendResult(err, success) {
		closeTransport(sendExit)

		function sendExit(e) {
			if (!err && !e) cb(null, success)
			else {
				var ee
				if (err) {
					ee = new Error('SENDFAILED')
					ee.initialError = err
					if (e) ee.closeError = e
				} else {
					ee = new Error('CLOSEFAILED')
					ee.initialError = e
				}
				ee.invocation = invocation
				cb(ee, success)
			}
		}
	}

	function closeTransport(cb) {
		var invocation = new Error(arguments.callee.name)
		transport.close(closeResult)

		function closeResult(err) {
			if (!err) cb()
			else {
				err.invocation = invocation
				cb(err)
			}
		}
	}
}

/*
What port is listened to?
the netServer listening event does not provide port.
'listening' is not emitted by raiServer or smtpServer

server:80:listenResult listening to: 38509
*/
//findPort()
function findPort() {
	var smtpServer = simplesmtp.createServer()
	var raiServer = smtpServer.SMTPServer
	var netServer = raiServer._server
	netServer.on('error', myErrorListener)

	smtpServer.listen(undefined, undefined, listenResult)

	function listenResult(err) {
		if (err) throw err

		require('haraldutil').p('listening to:', getPort(smtpServer))
	}

	function getPort(smtpServer) {
		var result
		var address = smtpServer && smtpServer.SMTPServer && smtpServer.SMTPServer._server &&
			smtpServer.SMTPServer._server.address()
		if (address && address.port) result = address.port

		return result
	}

	function myErrorListener(err) {
		if (!this._connected) require('haraldutil').pp(err)
	}
}

/*
Listen to a privileged port does not emit errors
the listen callback gets the error
RAIServer has an error listener that suppresses errors when not _connected

net.Server emits EACCESS
an 'error' listener on net.Server swallows the Error
RAIServer.prototype._createServer rai.js:113 adds _onError
line 122: only emits the error if _connected is true

server:82:myErrorListener object:Error {
  code: 'EACCES',
  errno: 'EACCES',
  syscall: 'listen',
  (nonE)(get)stack: Error: listen EACCES,
      at errnoException (net.js:900:11),
      at Server._listen2 (net.js:1019:19),
      at listen (net.js:1060:10),
      at Server.listen (net.js:1126:5),
      at RAIServer.listen (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/simplesmtp/node_modules/rai/lib/rai.js:89:18),
      at SMTPServer.listen (/home/foxyboy/Desktop/c505/node/nodejs3/node_modules/simplesmtp/lib/server.js:81:21),
      at listenErr (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/modules/simplesmtp/server.js:78:13),
      at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/modules/simplesmtp/server.js:70:1),
      at Module._compile (module.js:456:26),
      at Object.Module._extensions..js (module.js:474:10),
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'listen EACCES',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}

*/
//listenErr()
function listenErr() {
	var smtpServer = simplesmtp.createServer()
	var raiServer = smtpServer.SMTPServer
	var netServer = raiServer._server
	netServer.on('error', myErrorListener)

	smtpServer.listen(1, undefined, listenResult)

	function listenResult(err) {
		require('haraldutil').pargs(arguments)
	}

	function myErrorListener(err) {
		if (!this._connected) {
			require('haraldutil').pp(err)
		}
	}
}

/*
RAIServer extends Server EventEmitter
_server: Server
*/

/*
SMTPServer extends EventEmitter
.SMTPServer: RAIServer
listen(port, host, callback)
port: number > 0. 0: hangs
host: optional hostname
callback(err)

server:28 object:SMTPServer {
  domain: null,
  _events: {},
  _maxListeners: 10,
  options: {
    name: 'c505',
    authMethods: 2['PLAIN', 'LOGIN', (nonE)length: 2],
    disableEHLO: false,
    ignoreTLS: false
  },
  SMTPServer: object:RAIServer {
    domain: null,
    _events: {
      connect: function ()
    },
    _maxListeners: 10,
    options: {
      secureConnection: false,
      credentials: undefined,
      timeout: 60000,
      disconnectOnTimeout: false,
      debug: false
    },
    _server: object:Server {
      domain: null,
      _events: {
        connection: function (),
        error: function ()
      },
      _maxListeners: 10,
      _connections: 0,
      (get)connections: 0,
      _handle: null,
      _usingSlaves: false,
      _slaves: 0[(nonE)length: 0],
      allowHalfOpen: false,
      -- prototype: Server,
      _listen2: function (address, port, addressType, backlog, fd),
      listen: function (),
      address: function (),
      getConnections: function (cb),
      close: function (cb),
      _emitCloseIfDrained: function (),
      listenFD: function deprecated(),
      _setupSlave: function (socketList),
      ref: function (),
      unref: function (),
      -- prototype: EventEmitter,
      setMaxListeners: function (n),
      emit: function (type),
      addListener: function (type, listener),
      on: recursive-object#26,
      once: function (type, listener),
      removeListener: function (type, listener),
      removeAllListeners: function (type),
      listeners: function (type)
    },
    -- prototype: RAIServer,
    listen: function:3,
    end: function:1,
    _createServer: function:0,
    _onError: function:1,
    _serverListener: function:1,
    -- prototype: EventEmitter,
    setMaxListeners: recursive-object#24,
    emit: recursive-object#25,
    addListener: recursive-object#26,
    on: recursive-object#26,
    once: recursive-object#27,
    removeListener: recursive-object#28,
    removeAllListeners: recursive-object#29,
    listeners: recursive-object#30
  },
  -- prototype: SMTPServer,
  listen: function:3,
  end: function:1,
  _createSMTPServerConnection: function:1,
  -- prototype: EventEmitter,
  setMaxListeners: recursive-object#24,
  emit: recursive-object#25,
  addListener: recursive-object#26,
  on: recursive-object#26,
  once: recursive-object#27,
  removeListener: recursive-object#28,
  removeAllListeners: recursive-object#29,
  listeners: recursive-object#30
}
*/
//require('haraldutil').pp(new simplesmtp.createServer)

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
