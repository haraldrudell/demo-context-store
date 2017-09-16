// landing.js

module.exports = {
	getHandler: getHandler,
}

function getHandler(defaults, view) {
	require('applego').registerNamespace(view, socketConnect, 'userId')
	return function landing(request, response) {
		response.render(view, {
			title: 'Sky is the Limit'
		})
	}
}
function socketConnect(socket) {
	socket.on('in', function (data) {
		t('in:' + JSON.stringify(data))
		socket.emit('data', { got: data})
	})
}