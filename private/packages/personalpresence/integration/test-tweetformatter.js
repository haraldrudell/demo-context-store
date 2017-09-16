// test-tweetformatter.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var tweetformatter = require('../lib/views/harald/tweetformatter')

var p = require('loglocation').p
var pp = require('loglocation').pp
var path = require('path') // http://nodejs.org/api/path.html

var assert = require('mochawrapper') // https://github.com/haraldrudell/mochawrapper

var opts = getIntegrationConfiguration()
var skipTest = typeof opts === 'string' && 'Skipping: ' + opts

exports['TweetFormatter:'] = {
	'Single Tweet': function (done) {
		if (!skipTest) {
			var oauth = opts.views.harald.oauth
			var tweetOpts = {
				oauth: oauth,
				count: 1
			}

			tweetformatter.getTweetHtml(tweetOpts, tweetResult)
		} else {
			p(skipTest)
			done()
		}

		function tweetResult(err, tweetHtml) {
			if (err) assert.equal(err, null)

			assert.equal(typeof tweetHtml, 'string')
			assert.equal(tweetHtml.substring(0, 5), '<div>')
			p('Last tweet:', tweetHtml)

			done()
		}
	},
}

function parseTweet(tweet) {
	var result = tweet.text

	tweet.entities.urls.forEach(replaceUrl)

	return result

	function replaceUrl(urlObj) {
		result = result.replace(urlObj.url, urlObj.display_url)
	}
}

/*
Load configuration for integration test
return value: printable string on failure, otherwise object

the package name is read from package.json in this file's parent folder
A file by that name with extension json is looked for in the app folder in user's home folder

package: twlink
file: ~/apps/twlink.json
*/
function getIntegrationConfiguration() {
	var result

	var jsonFilename = path.join(__dirname, '..', 'package.json')
	var result = 'Json file could not be read: ' + jsonFilename
	var packageJson
	try {
		packageJson = require(jsonFilename)
	} catch (e) {}

	if (packageJson && packageJson.name) {
		var jsonFilename = path.join(process.env[process.platform === 'win32' ?
			'USERPROFILE' :
			'HOME'],
			'apps', packageJson.name + '.json')
		var result = 'Json file could not be read: ' + jsonFilename
		var json
		try {
			json = require(jsonFilename)
		} catch (e) {}
		if (json) result = json
	}
	return result
}
