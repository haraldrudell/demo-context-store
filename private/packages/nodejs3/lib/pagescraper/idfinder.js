// idfinder.js
// Extract the id for a scraped item
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// http://nodejs.org/docs/latest/api/url.html
var urlm = require('url')

exports.getId = getId

function getId(work) {
	var typeid = work.type.id
	work.result.id = ''

	if (typeid) {

		if (typeid.useMatch) {
			if (work.match) work.result.id = work.match
		}

		// add company name using selector
		if (typeid.selector3) {
			var companyName = work.el.parent().next().text().trim()
			if (companyName) work.result.id = companyName + '-' + work.result.id
		}

		// get id from a query parameter in the job link
		if (typeid.urlqp) {
			var parameterMap = urlm.parse(work.result.url, true).query
			work.result.id = parameterMap[typeid.urlqp]
			if (!work.result.id) {
				work.emitWarning('Expected query parameter missing', {qp: typeid.urlqp, url: work.result.url})
				work.result.id = ''
			}
		}

		// get id fromlast segment of url
		if (typeid.lastUrlSegment) {
			var last = work.result.url.slice(work.result.url.lastIndexOf('/') + 1)
			if (last) {
				if (typeid.lastUrlSegment == 'LinkUp') {
					var company = work.el.parent().find('.listing-url').attr('title')
					if (company) last = company + '-' + last
				}
				work.result.id = last
			}
		}

		if (typeid.linkup) {
			var company = work.el.parent().find('.listing-url').attr('title')
			work.result.id = company
		}

		if (typeid.beforeHyphen) {
			var p = work.result.id.indexOf('-')
			if (p != -1) work.result.id = work.result.id.substring(0, p)
		}

		if (typeid.afterHash) {
			var url = work.result.url
			var p = url.indexOf('#')
			if (p != -1) {
				work.result.id = url.substring(p + 1)
			}
		}

		if (typeid.urlSegments) {
			var urlObject = urlm.parse(work.result.url, true)
			var pathName = urlObject.pathname
			if (typeof pathName === 'string') {
				// we have something like '/a/b/'
				// remove possible terminating '/'
				var pos = pathName.slice(0, -1).lastIndexOf('/')
				if (pos != -1) pathName = pathName.substring(0, pos)
				pathName = pathName.replace(/\//g, '')
				if (pathName) work.result.id = pathName
			} else work.emitWarning('Bad url: pathname null', {url: work.result.url})
		}

		if (typeid.secondLastUrlSegment) {
			var last = work.result.url.lastIndexOf('/')
			if (last != -1) {
				var secondLast = work.result.url.substring(0, last).lastIndexOf('/')
				if (secondLast != -1) {
					var second = work.result.url.substring(secondLast + 1, last)
					if (second) work.result.id = second
				}
			}
		}

		// parse url
		if (typeid.jobidn) {
			var match = /\/jobid(\d+)-/.exec(work.result.url)
			if (match) match = match[1]
			if (match) work.result.id = match
		}

		if (typeid.stripJob) {
			var p = work.result.id.indexOf(',Job')
			if (p != -1) work.result.id = work.result.id.substring(0, p)
		}

	}
	if (typeid !== false && // we have not indicated that empty ids are allowed
		(typeid == null || typeid.id !== false) && // not in the item itself either
		!work.result.id) { // and there is no id
		// empty id where that is not allowed
		work.emitWarning('Required id missing', {title: work.result.title})
	}
}
