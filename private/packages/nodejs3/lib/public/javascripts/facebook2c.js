// facebook2.js

// inter-module sharing
if (typeof HRMODULE == 'undefined') HRMODULE = {}

if (typeof $ == 'undefined') alert ('jQuery is missing')
else $(function() {
	// jQuery loaded, document ready

	// direct or deferred facebook init
	if (typeof FB != 'undefined') {
		fbInit()
	} else {
		fbAsyncInit = fbInit
	}

	// initialize Facebook
	// if logged in, authorize with server
	// otherwise show login
	function fbInit() {

		console.log(FB.init({
			appId: '179548482130062',
			channelURL: 'localhost:3000/facebook/channel.html', // Channel File
			status: true, // check login status
			cookie: true, // enable cookies to allow the server to access the session
			xfbml: true  // parse XFBML
		}))

		FB.getLoginStatus(function(response) {
			if (response && response.authResponse) {
				serverConnect(response.authResponse)
			} else {
				// .authResponse: null
				// .status 'unknown'
				fbLogin()
			}
		})

	}

	function fbLogin() {
		$('#status').text('Logging in to Facebook')
		FB.login(function(response) {
			if (response.authResponse) {
				serverConnect(response.authResponse)
			} else {
				$('#status').text('please log in to Facebook and authorize this application')
			}
		}, {scope: 'email'})
	}

	function serverConnect(authResponse) {
		if (typeof io == 'undefined') return alert('socket io not loaded')

		$('#status').text('authorizing with server')
		var socket = io.connect(location.origin + '/facebook2')
		socket.on('connect_failed', function () {
			$('#status').text('No server connection')
		})
		socket.on('connect', function () {
			$('#status').text('Sending credentials...')
			socket.emit('skyin', { auth: authResponse })
		})
		socket.on('skyout', function (data) {
			var result = data.result ? 'good' : 'bad'
			$('#status').text(result)
		})
	}

	$('.login').click(fbLogin)
})
