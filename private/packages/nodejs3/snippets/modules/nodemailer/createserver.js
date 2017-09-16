// createserver.js
// examine nodemail.createServer
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var nodemailer = require('nodemailer') // https://github.com/andris9/nodemailer

var path = require('path') // http://nodejs.org/api/path.html
var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil

var log = require('haraldutil').p

var jsonKey = 'snippets-modules-nodemailer'
var jsonFilename = path.join(haraldutil.getHomeFolder(), 'apps', 'nodejs3.json')
var json = require(jsonFilename)[jsonKey]
if (!json) throw new Error('File: ' + jsonFilename + ' key: ' + jsonKey + ' missing.')

/*
Direct use of nodemailer

SERVER 1:
└──220 mx.google.com ESMTP hx1sm31294094pbb.35 - gsmtp
CLIENT 1:
└──EHLO [127.0.0.1]
SERVER 1:
└──250-mx.google.com at your service, [24.130.142.64]
   250-SIZE 35882577
   250-8BITMIME
   250-AUTH LOGIN PLAIN XOAUTH XOAUTH2 PLAIN-CLIENTTOKEN
   250 ENHANCEDSTATUSCODES
CLIENT 1:
└──AUTH PLAIN AHZha3RwYXJhZEBnbWFpbC5jb20AZ29ydWRlbGw=
SERVER 1:
└──235 2.7.0 Accepted
CLIENT 1:
└──MAIL FROM:<anonymous@[127.0.0.1]>
SERVER 1:
└──250 2.1.0 OK hx1sm31294094pbb.35 - gsmtp
CLIENT 1:
└──RCPT TO:<harald@attiresoft.com>
SERVER 1:
└──250 2.1.5 OK hx1sm31294094pbb.35 - gsmtp
CLIENT 1:
└──DATA
SERVER 1:
└──354  Go ahead hx1sm31294094pbb.35 - gsmtp
CLIENT (DATA) 1:
└──MIME-Version: 1.0
   X-Mailer: Nodemailer (0.5.2; +http://www.nodemailer.com/)
   Date: Wed, 28 Aug 2013 13:23:30 GMT
   Message-Id: <1377696210578.5725abda@Nodemailer>
   To: harald@attiresoft.com
   Content-Type: text/plain; charset=utf-8
   Content-Transfer-Encoding: quoted-printable
CLIENT (DATA) 1:
└──
SERVER 1:
└──250 2.0.0 OK 1377696212 hx1sm31294094pbb.35 - gsmtp
createserver:26:sendResult message id:(1377696210578.5725abda@Nodemailer)
createserver:36:closeResult Close successful.
*/
//miniMailer(json.create, json.send)
function miniMailer(options, sendOptions) {
	var transport = nodemailer.createTransport(options.transport || 'SMTP', options)
	if (!transport.transport) throw Error('nodemailer create transport failed')

	transport.sendMail(sendOptions, sendResult)

	function sendResult(err, success) {
		if (err) throw err
		if (success) {
			log('message id:(' + success.messageId + ')')
			if (Array.isArray(success.failedRecipients) && success.failedRecipients.length)
				log('Failed recipients:', success.failedRecipients)
		}

		transport.close(closeResult)
	}

	function closeResult(err) {
		if (err) throw err
		log('Close successful.')
	}
}

//sendGmail()
function sendGmail() {
	var type = 'SMTP' // string transport name SMTP/SES/SENDMAIL/STUB
	var options = {  // object
		service: 'Gmail' // predefined SMTP services: transport, host, secureConnection, port, requiresAuth, domains
	}

	/*
	instantiate a mail-sending tranport
	type: string service name
	options: object
	.service: optional string, for smtp predefined providers

	Return value is a Transport object from constructor in transport.js:29
	.options: the provided options object with modifications
	- .service: string tranportType
	.transportType: string the transport name
	.dkimOptions: false?
	.transport the Transport object or false
	.sendMail(options, callback): function

	transport.transport.pool is an event emitter
	if close is required, there is a transport.close function
	*/
	var transport = nodemailer.createTransport(type, options)

	// createserver:32 Successfully created transport: SMTP
	if (transport.transport) log('Successfully created transport:', transport.transportType)

	// createserver:33 Close is required
	if (transport.close) log('Close is required')

	/*
	createserver:37 object:Transport {
	  options: {
	    service: 'Gmail',
	    maxConnections: 5,
	    transport: 'SMTP',
	    host: 'smtp.gmail.com',
	    secureConnection: true,
	    port: 465,
	    requiresAuth: true,
	    domains: 2['gmail.com', 'googlemail.com', (nonE)length: 2]
	  },
	  transportType: 'SMTP',
	  dkimOptions: false,
	  transport: object:SMTPTransport {
	    options: recursive-object#2,
	    pool: object:SMTPConnectionPool {
	      domain: null,
	      _events: {},
	      _maxListeners: 10,
	      port: 465,
	      host: 'smtp.gmail.com',
	      options: recursive-object#2,
	      _connectionsAvailable: 0[(nonE)length: 0],
	      _connectionsInUse: 0[(nonE)length: 0],
	      _messageQueue: 0[(nonE)length: 0],
	      _idgen: 0,
	      -- prototype: SMTPConnectionPool,
	      sendMail: function:2,
	      close: function:1,
	      _createConnection: function:0,
	      _processMessage: function:2,
	      _onConnectionIdle: function:1,
	      _onConnectionRCPTFailed: function:2,
	      _onConnectionMessage: function:1,
	      _onConnectionReady: function:3,
	      _onConnectionError: function:2,
	      _onConnectionEnd: function:1,
	      -- prototype: EventEmitter,
	      setMaxListeners: function (n),
	      emit: function (type),
	      addListener: function (type, listener),
	      on: recursive-object#22,
	      once: function (type, listener),
	      removeListener: function (type, listener),
	      removeAllListeners: function (type),
	      listeners: function (type)
	    },
	    -- prototype: SMTPTransport,
	    initOptions: function:0,
	    sendMail: function:2,
	    close: function:1
	  },
	  sendMail: function:2,
	  -- prototype: Transport,
	  sendMailWithTransport: function:2,
	  useDKIM: function:1,
	  close: function:1
	}
	*/
	//require('haraldutil').pp(transport)

	/*
	options: object
	.encoding
	.charset
	.forceEmbeddedImages
	.auth object
	- .user, .pass, .XOAuth2, .XOAuthToken
	callback(): function
	*/
	var options = {}
	transport.sendMail(options, callback)

	function callback(err, x) {
		// createserver:117:callback Error: Authentication required, invalid details provided
		//require('haraldutil').pargs(arguments)

		if (transport.close) closeTransport()
	}

	function closeTransport() {
		transport.close(closeResult)
	}

	function closeResult(err) {
		if (err) throw err
		else log('Close successful.')
	}
}
