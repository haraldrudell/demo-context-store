// socktestc.js

if (typeof SOCKTESTC == 'undefined') SOCKTESTC = {}
SOCKTESTC.base = Date.now()
// initialize connect immediately	
;
(function () {
	//console.log(1, Date.now() - SOCKTESTC.base)
	// this takes 6 ms
	// socket.aState = 0 disconnected 1 connecting 2 connected 3 rejected
	var socket = io.connect(location.origin + '/socktest',
		{
			'connect timeout': 1000, // defaults to 10000 ms
			'reconnection limit': 1000, // defaults to Infinity ms
			'max reconnection attempts': 2, // defaults to 10
		//'heartbeat interval': 5,
		//'heartbeat timeout': 10,
	})

	var texts = {
		0: 'Disconnected',
		1: 'Connecting',
		2: 'Connected',
		3: 'Rejected',
	}

	socket.on('connect', function () {
		// 54 ms after io.connect, no arguments
		t('connect:' + socket.socket.sessionid)
		updateState(2)
	})

	socket.on('connect_failed', function (reason) {
		t('connect_failed' + (reason ? ' ' + reason : ''))
		updateState(3)
	})

	socket.on('data', function (data) {
		t('data ' + JSON.stringify(data))
	})

	socket.on('disconnect', function (reason) {
		// reason: string eg. 'booted'
		t('disconnect' + (reason ? ' ' + reason : ''))
		updateState(1)
	})

	socket.on('error', function (error) {
		// error is string
		t('error' + (error ? ' ' + error : ''))
	})

	function getState(newState) {
		var result = socket.aState || 0
		if (typeof newState == 'number' && newState >= 0) socket.aState = newState
		return result
	}

	function reconnect() {
		//socket.socket.disconnect()
		socket.socket.reconnect()
	}

	function send(data) {
		socket.emit('in', data)
	}

	updateState(1)

	// no socket below here

	$(function() {
		$('.dosend').click(function() {
			var o = {}
			t('click', o)
			//if (isConnected != 2) 
			send(o.elapsed)
		})
		$('.reconnect').click(function() {
			reconnect()
		})
		updateState(-1) // state when page is loaded
	})

	function reconnectEnable(flag) {
		var e = $('.reconnect')
		if (flag) e.removeAttr('disabled')
		else e.attr('disabled', 'disabled')
	}

	function updateState(newState) {
		var lastState = getState(newState)
		if (lastState != newState) {
			reconnectEnable(newState != 2)
			$('.connected').text(texts[newState])
		}
	}

	function t(event, o) {
		var now = Date.now()
		var hms = new Date(now).toISOString().substring(14,19)
		var elapsed = typeof t0 != 'undefined' ? t0 :
			(typeof SOCKTESTC != 'undefined' ? SOCKTESTC.base : 0)
		var elapsed = (now - elapsed) / 1000
		if (o) o.elapsed = elapsed
		var result = []
		if (typeof func != 'undefined') result.push(func)
		result.push(event)
		result.push(elapsed)
		result.push(hms)
		if (typeof isConnected == 'function') result.push(isConnected())
		if (typeof isConnecting == 'function') result.push(isConnecting())
		console.log(result.join(' '))
	}
})()




function obsolete() {

	// these are not important
	socket.on('connecting', function () {
		t('connecting')
	})
	socket.on('reconnecting', function () {
		t('reconnecting')
	})

	socket.on('reconnect', function () {
		t('reconnect')
	})

	// never get these
	socket.on('reconnect_failed', function () {
		console.log('reconnect_failed',t())
		updateState(0)
	})
	socket.on('anything', function (data) {
		console.log('anything', t(), JSON.stringify(data))
	})
	socket.on('message', function (message, cb) {
		console.log('message', t(), JSON.stringify(message))
		cb()
	})
	socket.on('reconnect_failed', function () {
		console.log('sreconnect_failed',t())
		updateState(0)
	})
}