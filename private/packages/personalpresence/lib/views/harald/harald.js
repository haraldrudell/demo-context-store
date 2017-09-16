// views/harald/harald.js
// Render Personal Presence root url using webfiller
// © 2012 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var tweetformatter = require('./tweetformatter')

/*
defaults: object created by webfillerapi.js initWebFiller
.appData: output from apprunner.getAppData()
.view: json config views key
.webfiller: options to webfiller
(any json options to webfillerapi, eg. defaultViewName)
- .resourceFolder: absolute path to public folder determined by expressapi
- .production: boolean if node configured for production
- .public: absolute path express' public folder as determined by webfillerapi
- .webFillerFolder
- .viewFolder: absolute path to view folder
- .defExt: string default view filenameextension
- .log: appData.log
- .websockets: websockets module if configured
viewName: string
*/
exports.getHandler = function handleIndex(defaults, viewName) {
	var viewOptions = defaults.view[viewName]
	return renderHarald

	function renderHarald(request, response) {

		// render the base view if not ajax
		if (!request.headers  || request.headers['x-requested-with'] != 'XMLHttpRequest') {
			var opts = {
				title: viewOptions.title,
				bindings: exports.fragments.index,
			}
			response.render(viewName, opts)
		} else renderAjax(request.query.q)

		function renderAjax(query) {
			if (query === 'tweets') tweetformatter.getTweetHtml({
				oauth: viewOptions.oauth,
				count: viewOptions.count,
				}, sendTweets)
			else sendTweets({message: 'Bad request'})
		}

		function sendTweets(err, html) {
			response.json(err ?
				{err: err.message} :
				{html: html})
		}
	}
}

exports.fragments = {
	index: {
/*
		'': {
			fragment: ['head'],
		},
*/
		h1: 'title',
	},
	head: {
		title: 'title',
	},
}
