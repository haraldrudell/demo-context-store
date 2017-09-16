var url = require('url')

var hostUrls = [
	'http://google.com',
	'https://google.com',
	'//google.com',
	'//google.com:1',
	'http://google.com:2',
	'%^&',
]

hostUrls.forEach(function(hostUrl) {
	var object = url.parse(hostUrl, false, true)
	console.log(hostUrl, ':', object)
})
