// socketioc.js
// benchmark socket communication

// wrapper for socks namespace
(function (globalObject) {

	// exports
	// launch function from web page
	globalObject.doWork = doWork

	// parameters
	var socksTimeout = 2000 // how long to give each socket, ms

	// https://github.com/LearnBoost/socket.io-client/blob/master/README.md
	// io is the JavaScript client object
	// defined by socket.io.js

	// store all transports while we use them one at a time
	var allTransports
	var wsUrl = location.origin + '/socketio'

	// this function is launched by clicking the Sock it! button
	// Check consistency, then launch
	function doWork() {

		// notify that JavaScript has launched
		output('Launch button clicked')

		// verify that socket io client is loaded
		if (typeof io === 'undefined' || typeof io != 'object') {
			output('io javascript object not defined')
			return
		}
		output('Socket io javascript client version:' + (io.version || 'unknown'))

		// verify that an array of transports is present
		if (!Array.isArray(io.transports)) {
			output('io.transports corrupt')
			return		
		}
		output('Available transports:' + io.transports.join(', '))

		if (!setTimeout instanceof Function) {
			output('setTimeout function not present')
			return
		}

		// io: Object object
		//console.log('io:', io)

		// connect using each available transport sequentially
		doTransport(0)
	}

	// attempt to connect using transport:index
	// index: index in io.transports
	function doTransport(index) {

		// store the complete list of transports so that we can restore it later
		if (!Array.isArray(allTransports)) allTransports = io.transports
		if (index < allTransports.length) {

			// configure for this exact transport
			var transport = allTransports[index]
			output('Connect using transport:' + transport)
			io.transports = [ transport ]

			var launchedNext = false
			var timer = setTimeout(myTimeout, socksTimeout)
			// connect(url, [ options ])
			// return value: the socket
			// returns a socket even if it fails
			var socket = io.connect(wsUrl, {
				'force new connection': true,
				'connect timeout': 500,
				'try multiple transports': false,
				reconnect: false
			})

			// socket failure
			// not reliably invoked - therefore we also have a timeout
			socket.on('connect_failed', function () {
				cancelTimeout('connection failed')
				nextTransport()
			})

			socket.on('connect', function () {
				output('Socket connected:' + getSocketStatus(socket))

				// setup data reception
				socket.on('news', function (data) {
					var b = Date.now() - a
					cancelTimeout('received ' + JSON.stringify(data) + ' ms:' + b)

					output('Disconnecting')
					socket.disconnect()

					nextTransport()
				})

				// send data to be echoed back
				var data = 'message'+ (index + 1)
				output('sending:' + data)
				var a = Date.now()
				socket.emit('my other event', {
					data: data
				})

			})

			// cancel the timer on response from io
			// message: string: result to be displayed
			function cancelTimeout(message) {
				clearTimeout(timer)
				output(message)
			}

			// socket timed out: progress to next
			function myTimeout() {
				output('Timed out')
				nextTransport()
			}

			function nextTransport() {
				if (!launchedNext) {
					launchedNext = true
					doTransport(index + 1)
				}
			}

		} else io.transports = allTransports
	}

	// get a printable status string for a socket
	// socket: a socket obtained by io.connect()
	// return value: printable string
	function getSocketStatus(socket) {
		var result = 'bad socket'
		if (socket.socket) {
			if (socket.socket.transport)
				result = 'type:' + socket.socket.transport.name
			if (socket.socket.connected) {
				result += '-connected'
			} else if (socket.socket.connecting) {
				result += '-connecting'
			} else
				result += '-idle'
		}
		return result
	}

	// output progress to web page by inserting text into the page
	// str: printable string
	function output(str) {
		var element
		if (typeof document != 'undefined' &&
			document &&
			document.getElementById instanceof Function)
			element = document.getElementById('insertLi')
		if (element) element.innerHTML += '<li>' + str + '</li>\n'
		else {
			var st = 'page missing required element'
			if (alert instanceof Function) alert(st)
			else console.log(st)
		}
	}

})(this)
