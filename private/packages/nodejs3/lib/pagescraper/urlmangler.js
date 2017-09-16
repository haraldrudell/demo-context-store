// urlmangler.js
// Extract the url for a scraped item
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// http://nodejs.org/docs/latest/api/url.html
var urlm = require('url')
// http://nodejs.org/docs/latest/api/util.html
var util = require('util')

exports.mangleUrl = mangleUrl

function mangleUrl(work) {

	// default url is href attribute or '#'
	work.result.url = (work.type.nourl ? work.listUrl : work.el.attr('href')) || '#'
	var urlMangler = work.type.url
	if (urlMangler) {

		if (urlMangler.parent) {
			var url = work.el.parent().attr('onclick')
			if (url) work.result.url = url
		}

		// onclick: true: append onclick attribute
		if (urlMangler.onclick && work.result.url == '#') {
			var oc = work.el.attr('onclick')
			// we will do a regExp so just add the onclick attribute to the url
			if (oc) work.result.url += oc
		}

		if (urlMangler.orgFormat) {
			var parameterMap = urlm.parse(work.result.url, true).query
			var rid = parameterMap[urlMangler.idqp]
			var otherMap = urlm.parse(work.listUrl, true).query
			var org = otherMap[urlMangler.orgqp]

			// get the proper url
			var url = '#'
			if (rid) {
				work.match = rid
				if (org) {
					url = util.format(urlMangler.orgFormat, org, rid)
				}
			}
			work.result.url = url
		}

		// singlelink: 'http:...': fixed link for all jobs
		if (urlMangler.singlelink) work.result.url  = urlMangler.singlelink

		// prependhost: true: prepend base page hostname
		if (urlMangler.prependhost) {
			// parse the url of the page being scraped
			var parsedUrl = urlm.parse(work.listUrl)
			// add the job url as its path
			parsedUrl.pathname = work.result.url
			work.result.url  = urlm.format(parsedUrl)
		}

		if (urlMangler.listUrl) {
			work.result.url = work.listUrl
		}

		if (urlMangler.prependUrl) {
			work.result.url = work.listUrl + work.result.url
		}

		if (urlMangler.isLinkedIn) {

			// get query parameters from the a element's href attribute
			var parameterMap = urlm.parse(work.result.url, true).query

			// find the url
			var url
			if (parameterMap[urlMangler.urlqp]) url = parameterMap[urlMangler.urlqp]
			if (!url) {
				// find a possible id
				var id = parameterMap[urlMangler.idqp]
				if (id != null && id != -1) {
					work.match = id

					url = util.format(urlMangler.urlFormat, id)
				}
			}
			// if neither, it's a warning
			if (!url) url = '#'
			work.result.url = url
		} else if (urlMangler.urlRegExp) {

			// urlRegExp... do some
			var match = urlMangler.urlRegExp.exec(work.result.url)
			// get the capture string
			if (match) match = match[urlMangler.matchIndex || 1]
			if (match) {
				// save the match string for use as id
				work.match = match
				work.result.url = util.format(urlMangler.urlFormat || '%s', match)
			} else {
				emitWarning('Could not mangle url', {url: work.result.url, regExp: urlMangler.urlRegExp})
				work.result.url = '#' // something's wrong, use a safe noop url
			}
		} else if (urlMangler.urlFormat) {
			work.result.url = util.format(urlMangler.urlFormat, match)
		}
	}
	if (urlMangler !== false && work.result.url === '#' || !work.result.url)
		work.emitWarning('Empty url', {title: work.result.title}) // empty id where that is not allowed
}
