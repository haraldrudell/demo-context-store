// twittertokenuser.js
// Verify an OAuth access tokens by using it with Twitter
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// https://github.com/ciaranj/node-oauth
var oauth = require('oauth')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')

var url = 'https://api.twitter.com/1.1/followers/ids.json?user_name=harud&stringify_ids=true'

var opts = {
	consumerKey: 'RGDk8Vk30lUsQZvQLKfw',
	consumerSecret: 'lcjCqdxSlEFkQ2FI3sYIf0FpfJYAMXaQ4M2xNWyWE8',
	access: {
		token: '7314512-Mi6qj78sVHBmuNAQHKqKv3TsmXXYPXDtnSSvmNdHnw',
		secret: '9oF89Cj7rn6UllLg3tyfNgXesdoHCfVB6WuPZG0Tms',
	}
}

if (true) {
	opts = require(path.join(haraldutil.getHomeFolder(), 'apps', 'cloudclearing.json'))
		.api.apiMap.twitterapi
}

verifyOpts(opts)

oauthConsumer = new oauth.OAuth(null, null, opts.consumerKey, opts.consumerSecret, '1.0', null, 'HMAC-SHA1')
oauthConsumer.get(url, opts.access.token, opts.access.secret, result)

/*
err is some object
body: string
result: http.IncomingMessage (http://nodejs.org/api/http.html#http_http_clientresponse)
*/
function result(err, body, respone) {
	if (err) require('haraldutil').p('err:', err)
	/*
	{
		"ids": ["254288563","28338565",...],
		"next_cursor": 0, "next_cursor_str":"0",
		"previous_cursor": 0, "previous_cursor_str": "0"
	}
	*/
	require('haraldutil').p(body)
}

function verifyOpts(opts) {
var options = ['consumerKey', 'consumerSecret']
var optionsAccess = ['token', 'secret', 'userId', 'username']
	if (!opts) throw new Error('Options not provided')
	if (!opts.access) throw new Error('Options missing access object')

	var heading = 'Option '
	options.forEach(verifyString)

	var heading = 'Option.access '
	opts = opts.access
	optionsAccess.forEach(verifyString)

	function verifyString(key) {
		var value = opts[key]
		if (typeof value !== 'string' || !value) throw new Error(heading + key + ' must is not a non-empty string')
	}
}
