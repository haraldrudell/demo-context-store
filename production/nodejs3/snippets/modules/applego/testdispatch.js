// testdispatch.js

var applego = require('applego')

/*
max pending requests
max output buffer level
abort flag
consumer function

function that issues requests
and there is a callback
these need to be in my code for variable scoping.

*/

stage(100, 5, 10)

function stage(delay, maxPending, items) {
	var disp = applego.getDispatcher(maxPending)

	start()

	// submit as many new requests as possible
	function start() {
		for (var t; t = disp.tryLaunch(); ) submit(t)
	}

	// submit one request and handle the response
	function submit(task) {
		setTimeout(complete, delay)

		function complete() {
			// one request completed
			disp.dec(task)

			// examine the response to see if more data is available
			if (items > 0) {
				items--
				if (items == 0) {
					disp.setAllStarted()
					if (!disp.getAndSetShutdown()) end()
				}
			}

			// try to launch more
			if (!disp.allHasStarted()) start()

			// buffer or forward data to next stage
			;

			// if we are complete, do end
			if (disp.allHasStarted()) {
				if (disp.isIdle()) {
					if (!disp.getAndSetShutdown()) end()
				}
			} else {
				// try to launch more if put changed anything
				start()
			}
		}

		function end() {
			console.log(arguments.callee.name, ':', disp.getStats())
		}
	}
}