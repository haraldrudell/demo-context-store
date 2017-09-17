(function ($) {
	var defaults = {
		username: 'Twitter',
		slides: 5,
		baseURL: 'https://api.twitter.com/1/statuses/user_timeline.json',
		width: 500,
		speed: 'fast',
		refreshTime: 600000
	};
	var storage = {
		store: {},
		init: function (element) {
			storage.element = element;
			if (!storage.element.hasClass('tweet_slider')) {
				storage.element.addClass('tweet_slider')
			}
			storage.element.data('currslide', new Number(1));
			$('<h4></h4>').html('We Tweet').prependTo(storage.element);
			storage.tweets_container = $('<ul></ul>');
			storage.tweets_container.appendTo(storage.element);
		},
		grab_tweets: function (options) {
			$.getJSON(options.baseURL + "?callback=?", "&screen_name=" + options.username + "&count=" + options.slides, function (data) {
				storage.store.tweets = data;
				storage.build_display();
				storage.addButtons(1);
				storage.element.css('width', options.width + 'px');
				storage.csswidth = data.length * options.width;
				storage.twidth = storage.csswidth - options.width;
				storage.tweets_container.css('width', storage.csswidth + 'px');
			});
			setTimeout(storage.refresh, options.refreshTime);
		},
		build_display: function () {
			if (typeof (storage.slides) != "undefined" && storage.slides.length > 0) {
				storage.tweets_container.html('').fadeIn('fast');
			}
			var tweets = storage.store.tweets;
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			for (i in tweets) {
				var tweet_html = $('<li></li>');
				tweet_html.css('width', options.width + 'px').append('<div><img align="left" src="' + tweets[i].user.profile_image_url + '" />');
				tweet_html.append('<span><a href="http://www.twitter.com/' + tweets[i].user.screen_name + '">' + tweets[i].user.screen_name + '</a>&nbsp;' + tweets[i].text.replace(exp, "<a href='$1'>$1</a>") + '</span>').append('</div>').appendTo(storage.tweets_container);
			}
			if ($(".controls").length < 1) {
				storage.controls = $('<div class="controls"></div>').hide('fast');
				storage.prevButton = $('<a href="#" class="prevButton"></a>');
				storage.prevButton.bind('click.tweetslider', function (e) {
					e.preventDefault();
					clearInterval(storage.timer);
					storage.timer = setInterval(storage.slide, 10000);
					storage.slide("prevSlide");
				});
				storage.nextButton = $('<a href="#" class="nextButton"></a>');
				storage.nextButton.bind('click.tweetslider', function (e) {
					e.preventDefault();
					clearInterval(storage.timer);
					storage.timer = setInterval(storage.slide, 10000);
					storage.slide("nextSlide");
				});
				storage.nextButton.hide().appendTo(storage.controls);
				storage.prevButton.hide().appendTo(storage.controls);
				storage.controls.show('fast').appendTo(storage.element);
			} else {
				storage.controls.show('fast');
			}
			$(storage.element).css('height', 'auto');
			while (i < tweets.length + 10) {
				if (i > tweets.length) {
					storage.timer = setInterval(storage.slide, 10000);
					break;
				}
				i++;
			}
		},
		refresh: function () {
			clearInterval(storage.timer);
			delete storage.timer;
			storage.slide("reset");
			storage.tweets_container.fadeOut('fast', function () {
				storage.controls.hide('fast');
				storage.grab_tweets(options);
			})
			return;
		},
		slide: function (operation) {
			storage.slides = storage.element.find('li');
			var total_width = -storage.twidth;
			var currpos = parseInt(storage.slides.css('left'));
			if (operation == "nextSlide") {
				var newpos = currpos - options.width;
				storage.slides.stop(true, true).animate({
					left: newpos + 'px'
				}, options.speed);
				var cs = (storage.element.data('currslide') + 1);
				storage.addButtons(cs);
				storage.element.data('currslide', cs);
			} else if (operation == "prevSlide") {
				var newpos = currpos + options.width;
				storage.slides.stop(true, true).animate({
					left: newpos + 'px'
				}, options.speed);
				var cs = (storage.element.data('currslide') - 1);
				storage.addButtons(cs);
				storage.element.data('currslide', cs);
			} else if (operation == "reset") {
				storage.slides.stop(true, true).animate({
					left: '0px'
				}, options.speed);
				cs = 1;
				storage.element.data('currslide', cs);
			} else {
				if (currpos > total_width) {
					var newpos = currpos - options.width;
					storage.slides.stop(true, true).animate({
						left: newpos + 'px'
					}, options.speed);
					var cs = (storage.element.data('currslide') + 1);
					storage.addButtons(cs);
					storage.element.data('currslide', cs);
				} else {
					storage.slides.stop(true, true).animate({
						left: '0px'
					}, options.speed);
					cs = 1;
					storage.addButtons(cs);
					storage.element.data('currslide', cs);
				}
			}
		},
		addButtons: function (currslide) {
			if (storage.tweets_container.find('li').length > 1) {
				if (currslide < storage.tweets_container.find('li').length) {
					storage.nextButton.show();
				}
				if (currslide > 1) {
					storage.prevButton.show();
				}
				if (currslide == storage.tweets_container.find('li').length) {
					storage.nextButton.hide();
				}
				if (currslide == 1) {
					storage.prevButton.hide();
				}
			}
		}
	};
	$.fn.tweetSlider = function (opts) {
		options = $.extend(defaults, opts);
		var $this = this;
		return this.each(function () {
			storage.init($this);
			storage.grab_tweets(options);
		});
	}
})(jQuery);