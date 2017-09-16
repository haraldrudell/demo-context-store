// pagescraper.js
// Extract data from a Web page
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

var urlmangler = require('./urlmangler')
var idfinder = require('./idfinder')
var jsontohtml = require('./jsontohtml')
var htmltodom = require('./htmltodom')

exports.processPage = processPage

/*
Scrape the body of a document
opts: object
.body: string: the body data to be scraped
.pageType: optional string: description for how to scrape the page eg. 'jobvite'
.url: the url for the company's job listings page, ie. the page whose body is being scraped
.sourceName: string name of the data source we are scraping
.filter: optional function: filtering titles
.emitter: emitter for 'data' and additional 'error' events
.wemitter: emitter for 'warning' events
cb(err) : function

pageType: object
.id
.url
.context

data items:
.result: title, id, url, sourceName
.url: string: the page that was scraped

default is to find all a elements whose contents give a true result from the opts.filter function
id is blank, url is the href attribute or '#'

*/
function processPage(opts, cb) {
	if (!opts) opts = {}
	var type = opts.pageType || {}
	var doc = opts.body
	var deDuper = {} // key: title + id, value: object
	var err

	// get the html string
	if (typeof opts.sourceName !== 'string' || !opts.sourceName) err = new Error('Bad options: name missing')
	else if (type.json) { // if body is json, extract html contents to doc
		var data = jsontohtml.jsonToHtml(doc, type.json) // opts.pageType.json the json key for the html data
		if (data instanceof Error) err = data
		else doc = data
	}
	if (!err && (typeof doc !== 'string' || !doc)) err = Error('empty document for data source: ' + opts.sourceName)

	// scrape the html
	if (!err) htmltodom.parseHtml(doc, extractElements) // creates a jQuery environment
	else end(err)

	function extractElements(err, $) {
		if (!err) {

			// find matching elements with or without context
			var elements
			var selector = type.selector || 'a'
			if (type.context) elements = $(selector, $(type.context))
			else elements = $(selector)
			if (!elements.length && !type.allowNoElements) emitWarning('No elements found', {url: opts.url})
			else elements.each(processElement)
		}
		end(err)

		function processElement() { // this is html element

			// create working item for this element
			var work = {
				el: $(this), // originally matched element wrapped as jQuery object
				type: type, // this page's type
				listUrl: opts.url, // the Web page with listings
				emitWarning: emitWarning, // warning emitter
				result : { // the output: sourceName, title, url, id
					sourceName: opts.sourceName
				},
			}

			// get title
			work.result.title = work.el.text().trim()
			if (type.title) {
				if (type.title.stripChar) {
					var regExp = new RegExp('type.title.stripChar', 'g')
					work.result.title = work.result.title.replace(regExp, '').trim()
				}
				if (type.title.skipFirst) work.result.title = work.result.title.substring(1).trim()
				else if (type.title.skipFrom) {
					var p = work.result.title.indexOf(type.title.skipFrom)
					if (~p) work.result.title = work.result.title.substring(0, p).trim()
				}
			}

			// filter title
			if (!opts.filter || (work.result.title && opts.filter(work.result.title))) {
				// the link text matches our desired job title

				if (!work.result.title) work.result.title = 'emptyString'

				urlmangler.mangleUrl(work)
				idfinder.getId(work, work.type.id, work.result)

				if (!err && isNew(work.result, deDuper)) { // emit deduped results
					var o = {
						result: work.result,
						url: work.listUrl,
					}
					opts.emitter.emit('data', o)
				}
			}
		}

	}

	function emitWarning(errorMessage, properties) {
		var e = new Error(errorMessage)
		e.sourceName = opts.sourceName
		for (var p in properties) e[p] = properties[p]
		opts.wemitter.emit('warning', e)
	}

	// this is the final callback
	function end(err) {
		cb(err)
	}

	function isNew(item, deDuper) {
		var result = true
		// scan for duplicates
		var dup = deDuper[item.title + item.id]
		if (dup) {

			// it might be a duplicate
			if (dup == item.url) {
				// true duplicate, ignore this item
				result = false
			} else {

				// same job title and id, different url
				// modify id
				var num = 1
				do {
					num++
					var newId = item.id + '#' + num
				} while (deDuper[item.title + newId])
				item.id = newId
			}
		}

		if (result) deDuper[item.title + item.id] = item.url

		return result
	}
}
