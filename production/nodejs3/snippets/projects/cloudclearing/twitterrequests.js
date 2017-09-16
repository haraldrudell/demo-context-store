// twitterrequests.js
// Verify an OAuth access tokens by using it with Twitter
// © 2012 Harald Rudell <harald@therudells.com> All rights reserved.

// https://github.com/ciaranj/node-oauth
var oauth = require('oauth')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/http.html
var http = require('http')

var log = haraldutil.p
var allFollowers
followerArray = ["254288563","28338565","12100122","341552391","71450413","16611962","15424493","1013241","47611734","785321995","35078981","561528955","20087429","16441295","1059191","15406610","137512387","10867302","340707371","582067790","77001781","18888797","140855840","90236377","138915287","34889128","380733279","314833823","191455079","252957641","21937994","6468662","321557827","234855315","14318059","156581207","200595571","351821245","14902202","171843686"]

// get OAuth data
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
oauthConsumer = new oauth.OAuth(null, null, opts.consumer.key, opts.consumer.secret, '1.0', null, 'HMAC-SHA1')

testFailure()

function testFailure() {
require('haraldutil').p()
	var url = 'https://api.twitter.com/1.1/followers/ids.json?user_name=harud&stringify_ids=true'
	oauthConsumer.get(url, null, null, getFollowers)
}

/*
err is some object
body: string
result: http.IncomingMessage (http://nodejs.org/api/http.html#http_http_clientresponse)

err is an object, not instanceof Error:
statusCode: number
data: string: response body, json-string
*/
function getFollowers(err, body, response) {
require('haraldutil').p()
	/*
	{
	statusCode: 400,
	data: '{"errors":[{"message":"Bad Authentication data","code":215}]}'
	}
	*/
	//if (err) log(makeTwitterError(err))

	/*
	constructor: IncomingMessage
	instanceof http.IncomingMessage
	doc: http://nodejs.org/api/http.html#http_http_clientresponse
	*/
	log('response:',
		response.constructor.name,
		response instanceof http.IncomingMessage)

	// string
	log(typeof body)

	var url = 'https://api.twitter.com/1.1/followers/ids.json?user_name=harud&stringify_ids=true'
	oauthConsumer.get(url, opts.access.token, opts.access.secret, getFirstFollower)
}

/*
{
	"ids": ["254288563","28338565",...],
	"next_cursor": 0, "next_cursor_str":"0",
	"previous_cursor": 0, "previous_cursor_str": "0"
}
*/
function getFirstFollower(err, body, response) {
require('haraldutil').p()
	if (!err) {
		var object = JSON.parse(body)
		if (!Array.isArray(object.ids)) throw new Error('ids missing')

		allFollowers = object.ids
		log('Follower count:', object.ids.length,
			'First follower id:', object.ids[0])

		// https://dev.twitter.com/docs/api/1.1/get/users/lookup
		var url = 'https://api.twitter.com/1.1/users/lookup.json?user_id=' + object.ids[0] + '&stringify_ids=true'
		oauthConsumer.get(url, opts.access.token, opts.access.secret, getAllFollowers)
	} else log(makeTwitterError(err))
}

/*
body is json string
array dimension 1
*/
function getAllFollowers(err, body, response) {
require('haraldutil').p()
	if (!err) {
		var object = JSON.parse(body)
		/*
		1[{
		    created_at: 'Sat Feb 19 00:45:10 +0000 2011',
		    entities: {
		      description: {
		        urls: 0[(nonE)length: 0]
		      },
		      url: {
		        urls: 1[{
		            expanded_url: null,
		            display_url: null,
		            indices: 2[0, 24, (nonE)length: 2],
		            url: 'http://www.helloivee.com'
		          }, (nonE)length: 1]
		      }
		    },
		    location: 'Los Angeles, CA',
		    id_str: '254288563',
		    protected: false,
		    profile_background_image_url_https: 'https://twimg0-a.akamaihd.net/profile_background_images/536177501/iv2_black_FRONT_low.jpg',
		    following: false,
		    status: {
		      text: 'You might think you can save calories by skipping breakfast but this is not the best idea. Breakfast eaters tend to weigh less than skippers',
		      created_at: 'Fri Feb 15 17:15:07 +0000 2013',
		      in_reply_to_user_id: null,
		      entities: {
		        urls: 0[(nonE)length: 0],
		        hashtags: 0[(nonE)length: 0],
		        user_mentions: 0[(nonE)length: 0]
		      },
		      id_str: '302466080138485760',
		      retweeted: false,
		      source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
		      geo: null,
		      in_reply_to_screen_name: null,
		      in_reply_to_status_id_str: null,
		      id: 302466080138485760,
		      in_reply_to_user_id_str: null,
		      place: null,
		      retweet_count: 0,
		      truncated: false,
		      contributors: null,
		      favorited: false,
		      coordinates: null,
		      in_reply_to_status_id: null
		    },
		    profile_sidebar_border_color: 'EEEEEE',
		    profile_use_background_image: true,
		    listed_count: 28,
		    notifications: false,
		    verified: false,
		    profile_image_url_https: 'https://twimg0-a.akamaihd.net/profile_images/2166677289/ivee_color_logo_normal.jpg',
		    screen_name: 'helloivee',
		    url: 'http://www.helloivee.com',
		    is_translator: false,
		    profile_link_color: '009999',
		    lang: 'en',
		    statuses_count: 2607,
		    follow_request_sent: false,
		    profile_text_color: '333333',
		    friends_count: 7580,
		    favourites_count: 1580,
		    id: 254288563,
		    contributors_enabled: false,
		    profile_banner_url: 'https://twimg0-a.akamaihd.net/profile_banners/254288563/1347992759',
		    profile_sidebar_fill_color: 'EFEFEF',
		    profile_image_url: 'http://a0.twimg.com/profile_images/2166677289/ivee_color_logo_normal.jpg',
		    name: 'ivee',
		    geo_enabled: true,
		    profile_background_image_url: 'http://a0.twimg.com/profile_background_images/536177501/iv2_black_FRONT_low.jpg',
		    profile_background_tile: true,
		    description: 'I\'m a talking voice controlled smart clock and my name is ivee! Interactive Voice is a hot start-up based in LA. We are bringing electronics to life!',
		    default_profile_image: false,
		    utc_offset: -32400,
		    default_profile: false,
		    followers_count: 12911,
		    time_zone: 'Alaska',
		    profile_background_color: '131516'
		  }, (nonE)length: 1]
		  */
		//haraldutil.pp(object)

		var user = object[0]
		log('name:', user.name, 'Twitter name:', user.screen_name, 'Twitter id:', user.id, 'chars:', body.length)

		var ids = allFollowers
		if (ids.length > 100) ids = ids.slice(0, 100)

		// 254288563,28338565,...
		//log('' + s)

		var url = 'https://api.twitter.com/1.1/users/lookup.json?user_id=' + ids + '&stringify_ids=true'
		oauthConsumer.get(url, opts.access.token, opts.access.secret, allResult)
	} else log(makeTwitterError(err))
}

function allResult(err, body, response) {
	if (!err) {
		var object = JSON.parse(body)
		if (Array.isArray(object)) {
			log('Requested:', Math.min(allFollowers.length, 100),
				'Received:', object.length, 'chars:', body.length)
		} else result = log('Response not array:', haraldutil.inspect(object))
	} else log(makeTwitterError(err))
}

function makeTwitterError(e, invocation) { // ensure instanceof Error
	if (!(e instanceof Error)) {
		if (typeof e !== 'object') e = new Error('Error value type: ' + typeof e + ' value: ' + String(e) || 'empty ')
		else { // interpret the object into an Error
			var e0 = e
			var message = ['Error from server:']

			if (typeof e.data === 'string') { // add string or json to error message
				var eDataObject
				try { // '{"errors":[{"message":"Bad Authentication data","code":215}]}'
					eDataObject = JSON.parse(e.data)
				} catch (e) {
					message.push('string:', haraldutil.inspect(e.data))
				}
				var didAdd
				if (eDataObject && Array.isArray(eDataObject.errors)) eDataObject.errors.forEach(saveError)
				if (!didAdd) message.push('json:', haraldutil.inspect(eDataObject, {singleLine: true, dateISO: true, errorPretty: true}))

				function saveError(errObj) {
					var s = []
					for (var p in errObj) s.push([p, ':'].join(''), errObj[p])
					if (s.length) {
						didAdd = true
						message.push(['[', s.join(' '),']'].join(''))
					}
				}
			}

			if (e0.statusCode) message.push('status code:', e0.statusCode)

			e = new Error(message.join(' '))
			for (var p in e0) e[p] = e0[p]
		}
	}
	if (invocation) e.invocation = invocation
	return e
}


function verifyOpts(opts) {
	var requiredOptions = {
		consumer: ['key', 'secret', 'callback'],
		access: ['token', 'secret', 'userId', 'username'],
	}
	var o
	for (var property in requiredOptions) {
		o = opts && opts[property] || {}
		requiredOptions[property].forEach(verifyString)

		function verifyString(key) {
			var value = o[key]
			if (typeof value !== 'string' || !value)
				throw new Error(['Options.', property, '.', key, ' is not a non-empty string'].join(''))
		}
	}
}
