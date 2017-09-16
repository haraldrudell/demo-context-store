// test-pagescraper.js
// © 2012 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var pagescraper = require('../lib/pagescraper/pagescraper')
var assert = require('mochawrapper')

exports['Page Scraper:'] = {
	'Invocation': function (done) {
		var opts = {
			body: '<p></p>', // must be non-empty string, parseable by jsdom
			sourceName: 'SOURCENAME', // must be non-empty string
			pageType: {allowNoElements: true}, // avoid empty-result warning
		}
		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			done()
		}
	},
	'Non-Id Element': function (done) {
		var expected = {
			sourceName: 'SOURCE',
			title: 'TITLE',
			url: 'URL',
			id: '',
		}
		var opts = {
			body: '<a href=' + expected.url + '>' + expected.title + '</a>',
			sourceName: expected.sourceName,
			pageType: {
				id: false, // false means id is not required
			},
			url: expected.url,
			emitter: {emit: emitFn},
		}

		var aEmit = []
		var eEmit = [['data', {url: expected.url, result: expected}]]
		function emitFn(event, data) {
			aEmit.push([event, data])
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(aEmit, eEmit)

			done()
		}
	},
	'Custom Selector': function (done) {
		var expected = {
			sourceName: 'SOURCE',
			title: 'TITLE',
			url: 'URL',
			id: '',
		}
		var opts = {
			body: '<b href=' + expected.url + '>' + expected.title + '</a>',
			sourceName: expected.sourceName,
			pageType: {
				selector: 'b',
				id: false,
			},
			url: expected.url,
			emitter: {emit: emitFn},
		}

		var aEmit = []
		var eEmit = [['data', {url: expected.url, result: expected}]]
		function emitFn(event, data) {
			aEmit.push([event, data])
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(aEmit, eEmit)

			done()
		}
	},
	'Context': function (done) {
		var expected = {
			sourceName: 'SOURCE',
			title: 'TITLE',
			url: 'URL',
			id: '',
		}
		var opts = {
			body: '<a href=ZZ>XX</a>' +
				'<div>' +
					'<a href=' + expected.url + '>' + expected.title + '</a>' +
				'</div>',
			sourceName: expected.sourceName,
			pageType: {
				context: 'div',
				id: false,
			},
			url: expected.url,
			emitter: {emit: emitFn},
		}

		var aEmit = []
		var eEmit = [['data', {url: expected.url, result: expected}]]
		function emitFn(event, data) {
			aEmit.push([event, data])
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(aEmit, eEmit)

			done()
		}
	},
	'Filter Function': function (done) {
		var expected = {
			sourceName: 'SOURCE',
			title: 'TITLE',
			url: 'URL',
			id: '',
		}
		var opts = {
			body:
				'<a href=' + expected.url + '>' + expected.title + '</a>' +
				'<a href=' + expected.url + '>badtitle</a>',
			sourceName: expected.sourceName,
			filter: filter,
			pageType: {
				id: false,
			},
			url: expected.url,
			emitter: {emit: emitFn},
		}

		function filter(foundTitle) {
			return foundTitle == expected.title
		}

		var aEmit = []
		var eEmit = [['data', {url: expected.url, result: expected}]]
		function emitFn(event, data) {
			aEmit.push([event, data])
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(aEmit, eEmit)

			done()
		}
	},
	'Empty AHref Warning': function (done) {
		var expected = {
			sourceName: 'SOURCE',
			title: 'TITLE',
			url: '#',
			id: '',
		}
		var opts = {
			body: '<a href=' + expected.url + '>' + expected.title  + '</a>',
			sourceName: expected.sourceName,
			pageType: {
				id: false,
			},
			url: expected.url,
			emitter: {emit: emitFn},
			wemitter: {emit: wemitFn},
		}

		var aEmit = []
		var eEmit = [['data', {url: expected.url, result: expected}]]
		function emitFn(event, data) {
			aEmit.push([event, data])
		}

		var awEmit = []
		var ewEmit = [{
			title: expected.title,
			sourceName: expected.sourceName,
			message: 'Empty url',
		}]
		function wemitFn(event, data) {
			assert.equal(event, 'warning')
			assert.ok(data)
			var wdata = {}
			wdata.title = data.title
			wdata.sourceName = data.sourceName
			wdata.message = data.message
			awEmit.push(wdata)
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(aEmit, eEmit)
			assert.deepEqual(awEmit, ewEmit)

			done()
		}
	},
	'Single Link': function (done) {
		var expected = {
			sourceName: 'SOURCE',
			title: 'TITLE',
			url: 'SINGLELINK',
			id: '',
		}
		var opts = {
			body: '<a href=URL>' + expected.title  + '</a>',
			sourceName: expected.sourceName,
			pageType: {
				url: {
					singlelink: expected.url,
				},
				id: false,
			},
			url: expected.url,
			emitter: {emit: emitFn},
		}

		var aEmit = []
		var eEmit = [['data', {url: expected.url, result: expected}]]
		function emitFn(event, data) {
			aEmit.push([event, data])
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(aEmit, eEmit)

			done()
		}
	},
	'Error Bad Options': function(done) {
		var didCb
		pagescraper.processPage(null, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			assert.ok(/Bad options.*/.test(err && err.message), err && err.message)

			done()
		}
	},
	'Error Empty Document': function(done) {
		var opts = {
			sourceName: 'SOURCENAME',
		}
		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			assert.ok(/empty document.*/.test(err && err.message), err && err.message)

			done()
		}
	},
	'Warning No Elements': function (done) {
		var expected = {
			sourceName: 'SOURCE',
		}
		var opts = {
			body: '<div/>',
			sourceName: expected.sourceName, // must be non-empty string
			wemitter: {emit: wemitFn},
		}

		var awEmit = []
		var ewEmit = [{
			sourceName: expected.sourceName,
			message: 'No elements found',
		}]
		function wemitFn(event, data) {
			assert.equal(event, 'warning')
			assert.ok(data)
			var wdata = {}
			wdata.sourceName = data.sourceName
			wdata.message = data.message
			awEmit.push(wdata)
		}

		var didCb
		pagescraper.processPage(opts, pagescraperCb)

		function pagescraperCb(err) {
			assert.ok(!didCb) // only one invocation allowed
			didCb = true
			if (err) assert.equal(err, false)

			assert.deepEqual(awEmit, ewEmit)

			done()
		}
	},
}
