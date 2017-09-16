// feedstep.js
// parse an rss2.0 feed
// © Harald Rudell 2012 MIT License

var require = require('apprunner').getRequire(require)
/*130211 processstep and dispatcher retired
var processstep = require('processstep')
// https://github.com/danmactough/node-feedparser
var feedparser = require('feedparser')
// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')

exports.getFeedStep = getFeedStep

function getFeedStep(dispatcher) {
	var processStep = processstep.initApi().getProcessStep(dispatcher)
	processStep.setLaunch(feedStep)
	return processStep

	function feedStep(opts, approval) {
		var sawCallback
		var parser = new feedparser()
		parser.parseUrl(opts.url, function jobFeeder(err, meta, articles) {
			if (!sawCallback) {
				sawCallback = true
				processStep.requestComplete(approval)
			}
			// meta is link to the feed feed title and such
			// article.title
			// article.link
			if (!err) {
				if (articles.length == 0) apprunner.anomaly(data, 'empty feed', meta)
console.log('feed', articles.length)
				articles.forEach(function (article) {
					if (!opts.filter || (article.title && opts.filter(article.title))) {
						var result = {}
						result.sourceName = opts.name
						result.title = article.title
						result.url = article.link
						result.id = article.link.slice(-article.link.lastIndexOf('/') + 1)
						result.published = article.pubDate
						fixDb(result)
/* producing results is disabled
						var o = {
							result: result,
							source: opts,
						}
						dispatcher.nextStepCb(o)

					}
				})
			} else {
				dispatcher.manageCb(err)
			}
			processStep.requestEnd()
		})
	}
}

function fixDb(result) {

	// get database collection
	var coll = require('./scrapemanager').getCollection()
	if (coll) {

		// find the record by url, there is only one active
		// ids and urls are different between feed and web
		coll.find({
			sourceName: result.sourceName,
			title: result.title,
			//id: new RegExp(result.id + '$'),
			lastSeen: {$exists: true},
		}).toArray(gotDoc)
	}

	function gotDoc(err, doc) {
		if (!err) {
			if (doc) {
				if (doc.length == 1) console.log(result.url, doc.url)
				if (doc.length != 1) console.log(doc.length)
				//console.log(typeof result.published, result.published, typeof doc.firstSeen, doc.firstSeen)
				//console.log(doc)
			}
			else console.log('no match:', result.id)
		} else console.log('Err', err.toString())
	}
}*/