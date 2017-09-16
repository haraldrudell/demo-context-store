// tweetformatter.js
// Provide html of tweets for personalpresence frontend
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var twlink = require('twlink')
var util = require('util') // http://nodejs.org/api/util.html

exports.getTweetHtml = getTweetHtml

/*
Read tweets from twitter and return formatted html
opts: object
.oauth: .consumer, .access
.count: number default 15
cb(err, html)
*/
function getTweetHtml(opts, cb) {
	var userId = opts.oauth.access.userId
	var twLink = new twlink.TwitterLink(opts.oauth)

	twLink.getUri({
		uri: '/statuses/user_timeline.json',
		params: {user_id: userId, count: opts.count || 15},
	}, getTweetsResult)

	function getTweetsResult(err, tweetList) {
		if (!err) tweetsToHtml(tweetList, cb)
		else cb(err)
	}
}

/*
tweetList: response from Twitter
cb(err, html)
*/
function tweetsToHtml(tweetList, cb) {
	var html = []

	tweetList.forEach(appendTweet)
	cb(null, html.join(''))

	function appendTweet(tweet) {
		var text = replaceEntities(tweet)

		html.push(tweetToHtml(text))
	}
}

/*
Convert a single tweet string to a set of HTMLELements
text: readable tweet

return value: html formatted tweet
*/
function tweetToHtml(text) {

	// TODO: maybe loop through each word of the tweet
	// in edge cases replacements may fail
	// parse the tweet using each of our regExps
	regExps.forEach(applyRegExp)
	return util.format(slidersHtml, text)

	function applyRegExp(regExp) {
		text = text.replace(regExp.search, regExp.replace)
	}
}

/*
Replace links in a tweet with a elements containing human readable links and resolved links
tweet: tweet object from Twitter

return value: string: tweet with a elements
*/
function replaceEntities(tweet) {
	var text = tweet.text
	var urlList = tweet.entities && tweet.entities.urls

	if (urlList) urlList.forEach(replaceUrl)

	return text

	/*
	urlObject: object
	.url: string
	.expanded_url: string
	.display_url: string
	.indices: array of number, dimension 2
	*/
	function replaceUrl(urlObject) {
		text = text.replace(urlObject.url,
			'<a class=tweetlink rel=external href="' +
			urlObject.expanded_url +
			'">' +
			urlObject.display_url +
			'</a>')
	}
}

var 	regExps = [
/* 130901 replaced with twitter entities
	{
		comment: 'Convert text links to prettier-looking html links',
		search: /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/ig,
		replace: '<a class=tweetlink rel=external href="$1">$3</a>',
	},
*/
	{
		comment: 'Convert Twitter usernames to html links',
		search: /(( )@|^@)([a-z0-9_]{1,15})/ig,
		replace: '$2<a class=tweetlink rel=external href=http://twitter.com/$3>@$3</a>',
	},
	{
		comment: 'Convert Twitter hashtags to html links',
		search: /(( )#|^#)([-a-z0-9_]*)/ig,
		replace: '$2<a class=tweetlink rel=external href=http://twitter.com/search/%23$3>#$3</a>',
	},
]

var slidersHtml = '<div class=class_box_shadow>' +
	'<div class=tweet>' +
	'<span class=tweetspan1/>' +
	'<span class=tweetspan2>%s</span>' +
	'</div>' +
	'<div class=sh_sides_left></div><div class=sh_sides_right></div>' +
	'</div>'

var slidersTwitter = {
	uri: "&screen_name=%s&count=%s",
	uricb: "?callback=?"
}
