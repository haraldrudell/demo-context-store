// index_1.js
// browser javascript for All Good Apps
// © Harald Rudell 2012

// inter-script sharing
if (typeof $ == 'undefined') alert('jQuery is missing')

// on parse if we have jQuery and socket.io
if (typeof $ != 'undefined') (function () {

	// on document ready
	$(function() {
		var aBsShow = $.fn.bsShow({
			effect: 'Scroll', //Jalousie',
			direction: 'horizontal',
			transitionDelay: 1000, // for Scroll, specified in hardcoded css
			transitionDuration: 4, // get notified exatly when a slide completes
			images: {
				'/images/sky.png': false,
				'/images/stocknoty.png': false,
				'/images/js.png': false,				
			}
		})

		// display the slider at image 0
		aBsShow.showUI(0)

		// first slide starts after 4 s
		setTimeout(goNext, 4000)

		// base time for printouts
		var t0 = Date.now()
var timer
var userTimer
		// at end we imediately jump to the beginning
		// this flag ignores the translate complete from that action
		var ignoreJump0Complete

		$(document).bind('end-transition.t-effect', function () {
			// some transition just completed

			if (!ignoreJump0Complete) {
				var isEnd = aBsShow.atEnd()
				if (isEnd) {
					ignoreJump0Complete = true
					console.log('AtEnd', (Date.now() - t0) / 1e3)
					aBsShow.jumpToZero()
				}
				if (timer) {
					// when the user clicks the controls
					// as many timers will complete
					// make sure all pages are shown at least 4 s
					clearTimeout(timer)
				}
				timer = setTimeout(goTimer, 4000)
				console.log('timer', (Date.now() - t0) / 1e3)
			} else ignoreJump0Complete = false
		})

		$(document).bind('userclick', function () {
			// the user operated one of the controls
			// provide 8 s for reading
			if (userTimer) clearTimeout(userTimer)
			userTimer = setTimeout(goUserTimer, 12000)
			console.log('userTimer', (Date.now() - t0) / 1e3)
		})

		function goTimer() {
			timer = null
			goNext()
		}

		function goUserTimer() {
			userTimer = null
			goNext()
		}
		function goNext() {
			if (!userTimer) {
				console.log('goNext', (Date.now() - t0) / 1e3)

				// jQuery miscalculates the width by 4 pixels
				// seems to be at the first transkate
				$('.te-slider').width('4000px')

				aBsShow.next()
			}
		}
	})
})();