// getfromfacebook.js
// processes a complete Facebook request

var request = require('request')
var fs = require('fs')

exports.getFromFacebook = getFromFacebook

var token = fs.readFileSync('/home/fasenode/token')

// retrieve a list of items from fb, one or more requests
// graph: uri for facebook, token will be appended
// callback(err, item)
// if error has value, no more calls, something failed
// if both null, there are no more data
// if callback returns false, item feed will stop, followed by a null,null invocation
function getFromFacebook(graph, callback) {
	var keepGoing = true
	var receivedAll = false
	var dataArray = []

	submitRequest(urlAndToken(graph))

	function submitRequest(url) {
		fbrq(url, function (error, data) {
			if (keepGoing) {
				if (error) {
					keepGoing = false
					callback(error, null)
				} else {
					// if there is data.data, this is a paged list
					// otherwise it is a json item
					if (!data.hasOwnProperty('data')) {
						callback(null, data)
					} else {

						// deal with paging and multiple requests
						receivedAll = !data['paging'] || !data.paging['next']
						if (!receivedAll) submitRequest(data.paging.next)
						// if this is the first of a request series, start processing
						dataArray.push(data.data)
						if (dataArray.length == 1) processData()
					}
				}
			}
		})
	}

	// feed dataArray to callback
	function processData() {
		while (keepGoing) {
			var ar = dataArray.shift()
			var result = ar.every(function (item, index) {
				return callback(null, item)
			})
			if (!result) {
				// callback told us to stop
				keepGoing = false
				break
			}
			if (dataArray.length == 0) break
		}
		if (keepGoing && receivedAll) {
			callback(null, null)
		}
	}

}

function urlAndToken(graph) {
	var result = 'https://graph.facebook.com' +
		graph
	result += (result.indexOf('?') == -1 ? '?' : '&') +
			'access_token=' + token
	return result
}

function fbrq(url, callback) {
	var error = null
	var object = null

	request(url, function (error, response, body) {
		if (!error) {
			if (response.statusCode != 200) {
				error = Error('status code:' + response.statusCode)
			} else {
				var anObject = eval('(' + body + ')')
				if (anObject == null || typeof anObject != 'object') {
					error = Error('corrupt data from fb')
				} else object = anObject
			}
		}
		callback(error, object)
	})
}
