// disrupt.js
// Notify of TechCrunch disrupt blog posts
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var require = require('apprunner').getRequire(require)

var caller = require('caller')
// https://github.com/mikeal/request
var requestm = require('request')
// https://github.com/danmactough/node-feedparser
var FeedParser = require('feedparser')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var pargs = haraldutil.pargs
var p = haraldutil.p
var lastDate
var defaultDuration = 3e4

exports.scrape = scrape

function scrape(opts, cb) {
	var isDone
	var log = opts.log

	requestm(opts.url).pipe(new FeedParser)
		.on('error', done)
		.on('readable', readFeed)

	function readFeed() {
		var post

		while (post = this.read()) {
			if (~post.title.indexOf(opts.titleHas)) {
				var date = post.pubdate.getTime()
				if (date > (lastDate || 0)) {
					log('Posting Date:', post.pubdate)
					lastDate = date
				} else post = null
				break
			}
		}
		if (!post) done()
		else placeCall()
	}

	function placeCall() {
		var aCaller = new caller.Caller({client: opts.client})
		var err

		aCaller.call({destination: opts.bnumber, from: opts.anumber, duration: defaultDuration}, callResult)

		function callResult(e) {
			err = e
			aCaller.close(closeResult)
		}

		function closeResult(e) {
			if (!err && e) err = e
			done(err)
		}
	}

	function done(e, result) {
		if (!isDone) {
			isDone = true
			cb(e, result)
		} else if (e) {
// TODO emit the error
		}
	}
}
