// test-mailout-gmail.js
// © Harald Rudell 2013 <harald.rudell@therudells.com> All rights reserved.

var mailout = require('../../lib/mailout')

var haraldutil = require('haraldutil') // https://github.com/haraldrudell/haraldutil
var path = require('path') // http://nodejs.org/api/path.html
var os = require('os') // http://nodejs.org/api/os.html
var stream = require('stream') // http://nodejs.org/api/stream.html
var util = require('util') // http://nodejs.org/api/util.html

var assert = require('mochawrapper') // https://github.com/haraldrudell/mochawrapper

var tenSeconds = 1e4
var jsonFilename = path.join(haraldutil.getHomeFolder(), 'apps', 'mx.json')
var fileMarker = path.basename(__filename, path.extname(__filename)) // test-mailsendergoogle
var senderMailbox = fileMarker + '@' + os.hostname() // test-mailsendergoogle@c505
var body = new Date().toISOString() // 2013-08-27T01:49:17.766Z
var p = haraldutil.p

var mailOut

exports['MailStreamToGmail:'] = {
	'Plain Text': function (done) {
		this.timeout(tenSeconds)

		// load test configuration from .json file
		var json = require(jsonFilename)
		assert.ok(json[fileMarker], jsonFilename +' missing key: ' + fileMarker)

		createPool()

		function createPool() {
			var options = haraldutil.clone(json[fileMarker].connect) || {}
			var printable = haraldutil.clone(options)
			if (printable.auth && printable.auth.pass) printable.auth.pass = 'xxx'
			p('MailSender options:', printable)

			mailOut = new mailout.MailOut(options)
				.on('error', errorListener)
				.once('ready', sendMail)
		}

		function sendMail() {

			var options = haraldutil.clone(json[fileMarker].send) || {}
			p('send options:', options)

			mailOut.getWritable(options, streamBody)
		}

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

		function streamBody(err, writable) {
			if (err) assert.equal(err, null)

			new MessageStream().pipe(writable)
				.once('rcptFail', recipientListener)
				.on('error', errorListener)
				.once('complete', closePool)
		}

		function recipientListener(recipients) {
			assert.ok()
		}

		function closePool(success, line) {
			assert.ok(success)

			require('haraldutil').p('Line:(' + line + ')')

			mailOut.close(closeResult)
		}

		function closeResult(err) {
			if (err) assert.equal(err, null)

			done()
		}

		function errorListener(err) {
			assert.equal(err, null)
			assert.ok()
		}
	},
	'after': function (done) {
		if (mailOut) {
			var m = mailOut
			mailOut = null
			if (m.close) m.close(end)
			else end()
		} else end()

		function end(err) {
			if (err) throw err
			done()
		}
	}
}
