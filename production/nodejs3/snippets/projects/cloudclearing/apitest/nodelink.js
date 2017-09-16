// nodelink.js
// scrape linkedin from the backend

// imports
// https://github.com/tmpvar/jsdom
var jsdom = require('jsdom')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// https://github.com/mikeal/request
var request = require('request')
// http://nodejs.org/docs/latest/api/url.html
var urlnode = require('url')

// class variables
// the url to scrape
// append &page_num=
var url = 'http://www.linkedin.com/profile/connections?id=3019137'
var loginString = 'Sign in to LinkedIn'
var cookieFile = getHomeFolder() + '/linkedincookies.json'

doGet(url)

function doGet(url) {
	var result = {}
	var resultCount = 0
	var pageNum = 0
	var cookies = request.jar()
	var didLogin
	var jQuery

	var fileCookies = readCookies(cookieFile)
	if (fileCookies) cookies.cookies = fileCookies
	var cookiedRequest = request.defaults({jar: cookies })

	doTheGet()

	function doTheGet() {
		console.log('get')
		var myUrl = url
		if (pageNum != 0) myUrl += '&page_num=' + pageNum
		cookiedRequest(myUrl, function(error, response, doc) {
			if (error) console.log(error)
			else {
				saveCookies(cookieFile, cookies.cookies)
				if (response.statusCode != 200) {
					console.log('statusCode:', response.statusCode)
				} else if (doc.indexOf(loginString) != -1) {
					// need to login
					if (didLogin) throw Error('fail')
					didLogin = true
					doLogin(doc)
				} else {
					/*
					saveResponse(
						getHomeFolder() + '/responses',
						url,
						doc,
						JSON.stringify(response.headers),
						JSON.stringify(cookies.cookies))
					*/
					processPage(doc)
				}
			}

		})
	}

	// write cookies cookie-array to file fileName
	// cookie-array is eg. cookieJar.cookies
	//
	// A cookie is a flat key-value object
	// special case: the expires property can be of type Date, which json can not serialize
	// special case: the expires field can be Infinity
	function saveCookies(cookieFile, cookies) {

		// we are going to modify the expires property, so this reference needs to be cloned
		// therefore the top-level cookie object must be cloned
		// because cookie is flat, we do not have to do deep clone
		var fileData = []
		cookies.forEach(function(cookie) {
			var cookieClone = {}
			for (var property in cookie) {
				cookieClone[property] = cookie[property]
			}

			// now make expires jsonable
			var expires = cookie.expires
			cookieClone.expires =
				isFinite(expires) ?
				expires.getTime() : // it was Date
				'Infinity' // it was Infinity
			fileData.push(cookieClone)
		})
		fs.writeFileSync(cookieFile, JSON.stringify(fileData))

		/* read and verify what we just wrote
		var readCookieData = readCookies(cookieFile)
		var assert = require('assert')
		assert.deepEqual(cookies, readCookieData)
		*/
	}

	// return value: array of cookie data or undefined
	function readCookies(cookieFile) {

		// read cookie json from the file
		var cookies
		try {
			var readString = fs.readFileSync(cookieFile)
			var readObject = JSON.parse(readString)
			if (readObject) cookies = readObject
		} catch (e) {
			var bad = true

			// ignore file not found
			if (e instanceof Error && e.code == 'ENOENT') bad = false

			if (bad) throw e
		}

		// if we have data, transform it into cookie data
		if (cookies) {

			// special case: the expires property value
			// either Date or Infinity
			cookies.forEach(function(cookie) {
				var value = cookie.expires
				cookie.expires =
					value == 'Infinity' ?
					Infinity :
					new Date(value)
			})
		}

		return cookies
	}

	function doLogin(body) {
		console.log('login')
		// parse the document and extract the form data
		var formData = {
			data: {}
		}
		parseForm(submitForm)

		function parseForm(callback) {
			jsdom.env({
				html: body,
				src: getJQuery(),
				done: function(errors, window) {
					if (errors) console.log(errors)
					else {
						var $ = window.$
						var form = $('#login')
						formData.uri = $(form).attr('action')
						formData.method = $(form).attr('method')
						$('input', form).each(function() {
							formData.data[$(this).attr('name')]  =
								$(this).val()
						})
						callback()
					}
				}
			})
		}

		function submitForm() {
			// check formData
			if (!formData.uri || !formData.method ||
				Object.keys(formData.data).length == 0 ||
				!formData.data.hasOwnProperty('session_key') ||
				!formData.data.hasOwnProperty('session_password')) {
				console.log('parse form failed:', formData)
			} else {
//				formData.data['session_key'] = 'storage43+x@gmail.com'
//				formData.data['session_password'] = 'abcabd'
				formData.data['session_key'] = 'linkedin17@inbox247.com'
				formData.data['session_password'] = 'verygood'
				var bodyString = urlnode.format({ query: formData.data })
				bodyString = bodyString.substring(1, bodyString.length)
				//console.log('data:', formData.data)
				//console.log('bodyString:', bodyString)
				cookiedRequest.post({
					headers: {
						'content-type' : 'application/x-www-form-urlencoded',
					},
					url: 'https://www.linkedin.com' + formData.uri,
					body: bodyString,
				}, function(error, response, doc) {
					if (error) console.log(error)
					else {
						if (response.statusCode == 302) {
							doTheGet()
						} else if (response.statusCode != 200) {
							console.log('statusCode:', response.statusCode)
						} else {
							console.log('doc:', doc)
						}
					}
				})
			}
		}
	}

	function processPage(doc) {
		console.log('process')
		jsdom.env({
			html: doc,
			src: getJQuery(),
			done: function(errors, window) {
				var found = false
				if (errors) console.log(errors)
				else {
					var $ = window.$
					var contactsDiv = $('#member-connections')
					var liTags = $('li', contactsDiv)
					$(liTags).each(function() {
						found = true
						var aTag = $('a[rel="contact"]', this)
						var name = $.trim($(aTag).text())
						var uri = $(aTag).attr('href')
						var amp = uri.indexOf('&')
						if (amp != -1) uri = uri.substring(0, amp)
						var obj = {
							name: name,
							uri: uri
						}
						result[resultCount++] = obj
					})
					if (!found) goDone()
					else {
						console.log('resultCount:', resultCount)
						pageNum++
						doTheGet()
					}
				}
			}
		})
	}

	function goDone() {
		console.log('goDone')
		var file = __dirname + '/' + getDateString()
		fs.writeFileSync(file,
			JSON.stringify(result))
		console.log('complete')
	}

	function getJQuery() {
		if (!jQuery) jQuery = fs.readFileSync(__dirname + '/jquery-1.7.2.min.js').toString()
		return jQuery
	}

}

var allowed = '-.0123456789abcdefghijklmnopqrstuvwxyz'
function saveResponse(folder, url, doc, headersJsonString, cookieArrayJsonString) {

	// get filename based on url
	var filename = ''
	var date = getDateString()
	for (index in url) {
		var char = url.charAt(index)
		if (allowed.indexOf(char) == -1) char = allowed[0]
		filename += char
	}
	filename = folder + '/' + filename + '_' + date

	fs.writeFileSync(filename + '.html', doc)
	fs.writeFileSync(filename + '.json', headersJsonString)
	fs.writeFileSync(filename + '_cookies.json', cookieArrayJsonString)	
}

function getDateString() {
	cString = new Date().toISOString()
	var result =
	cString.substring(0, 4) + cString.substring(5, 7)  + cString.substring(8, 10) +
	'_' +
	cString.substring(11, 13) + cString.substring(14, 16) + cString.substring(17, 19)
	return result
}

function getHomeFolder() {
	return process.env[
		process.platform == 'win32' ?
		'USERPROFILE' :
		'HOME']
}
