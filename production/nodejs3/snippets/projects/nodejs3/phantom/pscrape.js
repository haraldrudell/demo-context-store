// pscrape.js
// Scrape a Web page using phantom.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/docs/latest/api/util.html
var util = require('util')

var phantom = require('node-phantom')
var log = console.log

log('pid:', process.pid)
var p1
process.nextTick(start)

function start() {
	p1 = new Phantom({page: 'http://www.google.com'})
}

/*
Instantiate a phantom headless browser
opts: object
.page: optional string: url to load

emits 'ready' when child process ready
instantiate takes about 0.8 s
creating a page takes 7 ms
*/
function Phantom(opts) {require('haraldutil').p(new Date, opts && opts.page)
	var self = this
	events.EventEmitter.apply(this)
	this.close = close
	this.loadPage = loadPage
	var phantomProxy
	var t0 = Date.now()
	var pages = {}
	var pageId = 1

	phantom.create(created)

	/*
	Callback from instantiating a phantom process
	proxy: object
	.createPage(cb())
	.injectJs(filename, cb())
	.addCookie(cookie, cb())
	.exit(cb())
	.on(...)
	_phantom: ChildProcess
	*/
	function created(err, proxy) {require('haraldutil').p(Date.now() - t0)
		if (!err) {
			phantomProxy = proxy
			if (opts.page) loadPage(opts.page, pageResult)
			self.emit('ready')
		} else emitError(err)
	}

	function loadPage(url, cb) {require('haraldutil').p(Date.now() - t0)
		var page
		if (phantomProxy) phantomProxy.createPage(openUrl)
		else cb(new Error('No instance'))

		/*
		pageProxy: object
		.close(cb())
		.evaluate(evaluator, cb())
		.evaluateAsync(evaluator, cb())
		.get(name, cb())
		.includeJs(url, cb())
		.injectJs(url, cb())
		.open(url, cb())
		.render(filename, cb)
		.renderBase64(extension, cb)
		.sendEvent(event, x, y, cb
		.set(name, value, cb))
		.setFn(pageCb, fn, cb)
		uploadFile(selector, filename, cb)
		*/
		function openUrl(err, pageProxy) {require('haraldutil').p(Date.now() - t0)
			if (!err) {
				page = pageProxy
				page.open(url, opened)
			} else cb(err)
		}

		/*
		status: string: 'success'
		*/
		function opened(err, status) {require('haraldutil').p(Date.now() - t0)
			if (!err) {
log('DONE', status)
				cb(null, page)
			} else cb(err)
		}
	}

	function pageResult(err) {
		if (err) emitError(err)
		close()
	}

	function close(cb) {
		if (phantomProxy) {
			var p = phantomProxy
			phantomProxy = null
			p.exit(closeDone)
		} else closeDone()

		function closeDone(err) {
			if (cb) cb(err)
			else if (err) emitError(err)
		}
	}

	function emitError(e) {
		self.emit('error', e)
	}
}
util.inherits(Phantom, events.EventEmitter)
