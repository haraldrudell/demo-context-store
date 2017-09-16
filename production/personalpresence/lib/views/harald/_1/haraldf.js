// views/harald/_1/haraldf.js
// front-end JavaScript for http://haraldrudell.com
// © Harald Rudell 2012

// inter-module sharing
if (typeof HRMODULE == 'undefined') HRMODULE = {}

// twitter loaded listener queue
if (typeof twttr == 'undefined') {
	var t
	twttr = t = {_e: [], ready: function(f) {t._e.push(f)}}
}

if (typeof $ == 'undefined') alert ('jQuery is missing')
else {

	// immediately
	(function() {

		var debug = $.cookies.get('debug')
		if (debug) HRMODULE.debug = true

		// track +1 button
		HRMODULE.trackplus = function(params) {
			console.log('trackplus')
			// has href and state
			trackEvent('PlusOne', params.href, params.state)
			console.log('done')
		}

		twttr.ready(function(tw) {
			tw.events.bind('click', clickEventToAnalytics)
			tw.events.bind('tweet', tweetIntentToAnalytics)
			tw.events.bind('retweet', retweetIntentToAnalytics)
			tw.events.bind('favorite', favIntentToAnalytics)
			tw.events.bind('follow', followIntentToAnalytics)
		})

		function clickEventToAnalytics(intent_event) {
			if (intent_event) {
				// tweet: click on tweet button
				// count: click on twet count
				// follow: click follow button
				// screen_name: cklick on follow
				trackEvent('Twitter', 'click', intent_event.region)
			}
		}

		function tweetIntentToAnalytics(intent_event) {
			if (intent_event) {
				trackEvent('Twitter', 'tweet', intent_event.type)
			}
		}

		function retweetIntentToAnalytics(intent_event) {
			if (intent_event) {
				trackEvent('Twitter', 'retweet', intent_event.type + ',' +
					intent_event.data.source_tweet_id)
			}
		}

		function favIntentToAnalytics(intent_event) {
			if (intent_event) {
				trackEvent('Twitter', 'fav', intent_event.type)
			}
		}
		function followIntentToAnalytics(intent_event) {
			if (intent_event) {
				pageTracker._trackEvent('Twitter',
					'follow',
					intent_event.type + ',' + intent_event.data.user_id +
					" (" + intent_event.data.screen_name + ")"
					)
			}
		}

		function trackEvent(event, category, label) {
			var x = _gaq.push(['_trackEvent', event, category, label])
			if (HRMODULE.debug) {
				alert('tracking errors: ' + x + '\n' +
						['_trackEvent', event, category, label]
					)
			}
		}
	})()

	// when document ready
	$(function() {

		$('.linkhere').attr('href', '/assets/Harald%20Rudell.vcf')

		HRMODULE.externalTracker = function(e) {
			try {
				// get the external link string that we will redirect to
				var link = $(this).attr('href')
				// find if it is a link in the tweet scroller
				var label = $(this).hasClass('tweetlink') ? 'tweet' : undefined
				// issue track request, return value is number of failing actions
				var x = _gaq.push(['_trackEvent', 'Exit' ,  link, label])
				var doit = true
				if (HRMODULE.debug) {
					doit = confirm('Load ' + link + '?\n' +
						'tracking errors: ' + x + '\n' +
						['_trackEvent', 'Exit' ,  link, label]
						)
				}
				if (doit) {
					// perform the redirect delayed
					setTimeout(function() {
						document.location = link
						}, 300)
				}
				// disable default redirect in order to use th delayed redirect
				e.preventDefault()
			} catch (err) {
				if (HRMODULE.debug) {
					alert(err)
					e.preventDefault()
				}
			}
		}

		// track clicks on outgoing a links
		$("a[rel*='external']").click(HRMODULE.externalTracker)

		// TODO make this css animation if jQuery doesn't do that already
		// TODO get all data from json file/web

		// our only namespace object
		// key: html element containing this slider
		// value: object, our internal data
		var sliders = {}

		// default options
		sliders.defaults = {
			slides: 15,
			baseURL: 'https://api.twitter.com/1/statuses/user_timeline.json',
			width: 500,
			seconds: 6,
			speed: 'slow',
			username: 'Twitter'
		}

		// format tweet to html
		sliders.html = {
			regExps: [
				{
					comment: 'Convert text links to prettier-looking html links',
					search: /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/ig,
					replace: '<a class=tweetlink rel=external href="$1">$3</a>',
				},
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
			],
			html: '<div class=class_box_shadow>' +
				'<div class=tweet>' +
				'<span style="padding: 0px; height:100%"/>' +
				'<span>%s</span>' +
				'</div>' +
				'<div class=sh_sides_left></div><div class=sh_sides_right></div>' +
				'</div>'
		}

		sliders.twitter = {
			uri: "&screen_name=%s&count=%s",
			uricb: "?callback=?"
		}

		/*
		setup sliding of element
		element: a single HTMLElement
		opts: not used
		element is a container that we will slide
		we will put all tweets inside element, so we can slide them at once
		it will be clipped agains some other element
		*/
		function init(element, opts) {
			var options = $.extend(sliders.defaults, opts)
			var username = (element = $(element)).text()
			if (username) options.username = username

			// create our internal data container
			var self = {id: Math.random()}
			sliders[self.id] = self

			// fetch tweets from twitter
			$.getJSON(location.origin + location.pathname + '?q=tweets', tweetResult)

			function tweetResult(data) {
				if (data && typeof data.html == 'string') {
					// insert the list of tweets into the page so that we can figure out how high they are in pixels
					element.empty()
					element.append($(data.html))
					// a bug in animator adds '-webkit-transition...' remove it here
					element.css('display', 'block')

					if (element.height() > element.parent().height()) { // we need to scroll
						// scrolling is required
						self.slides = options.slides
						// duplicate the tweets, so that we can have the first tweet scrolled in from below after the last
						element.append($(data.html).clone())
						// this is the tweet shown at the top, 0-based
						self.pos = 0
						self.timer = setInterval(slide, options.seconds * 1000)
					}

					// add external link tracking
					element.find("a[rel*='external']").click(HRMODULE.externalTracker)
				} else alert('ajax response problem')
			}

			// slide the duplicated tweets upwards slowly
			// jump back to zero when half way
			function slide() {
				// if we have slid to the halfway point, move slider back
				if (self.pos == self.slides && self.pos > 0) {
					self.pos = 0 //element.css('top', self.pos = 0)
					element.attr('style', 'display: block')
				}

				// this is how many pixels we should slide this time
				var slideUpPixels =
					element.children().eq(self.pos + 1).position().top -
					element.children().eq(self.pos++).position().top

				element.animate({top: '-=' + slideUpPixels}, {queue: false, duration: 3000})
			}

			// make a list of tweets ready for page insertion
			function tweetsJsonToHtml(tweetsJson) {

				// create a root div that will contain one child div per tweet
				var tweetsHtmlRoot = $('<div>')
				tweetsJson.forEach(function(tweet) {
					// add this tweet to the list of tweets
					tweetsHtmlRoot.append(tweetToHtml(tweet.text))
				})
				return $(tweetsHtmlRoot).contents()
			}

			// convert a single tweet string to a set of HTMLELements
			function tweetToHtml(text) {

				// TODO: maybe loop through each word of the tweet
				// in edge cases replacements may fail
				// parse the tweet using each of our regExps
				sliders.html.regExps.forEach(function (regExp) {
					text = text.replace(regExp.search, regExp.replace)
				})

				return util.format(sliders.html.html, text)
			}

		} // init

		var formatRegExp = /%[sdj%]/g;
		var inspect = JSON.stringify
		var util = {}
		util.format = function(f) {
			if (typeof f !== 'string') {
				var objects = [];
				for (var i = 0; i < arguments.length; i++) {
					objects.push(inspect(arguments[i]));
				}
				return objects.join(' ');
			}
			var i = 1;
			var args = arguments;
			var len = args.length;
			var str = String(f).replace(formatRegExp, function(x) {
				if (i >= len) return x;
				switch (x) {
					case '%s': return String(args[i++]);
					case '%d': return Number(args[i++]);
					case '%j': return JSON.stringify(args[i++]);
					case '%%': return '%';
					default:
						return x;
				}
			});
			for (var x = args[i]; i < len; x = args[++i]) {
				if (x === null || typeof x !== 'object') {
					str += ' ' + x;
				} else {
					str += ' ' + inspect(x);
				}
			}
			return str
		}

		// add the jQuery plugin tweetSlider
		$.fn.tweetSlideV = function (opts) {
			// this reference is a container HTMLElements, maybe a div
			// text content is a Twitter username

			// process every element provided in this
			return this.each(function () {
				init(this, opts)
			})
		}

		// dispay tweets on all elements of that has tweetslider class
		$('.tweetslider').tweetSlideV()

	}) // jQuery document ready
} // if jQuery
