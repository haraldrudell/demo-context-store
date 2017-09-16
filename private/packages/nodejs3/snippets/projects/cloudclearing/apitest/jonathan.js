// jonathan.js
// Get jonathans

// imports
var linkedin = require('linkedin')
var haraldops = require('haraldops')
var express = require('express')
var utils = require('../node_modules/linkedin/example/utils')
var jsonhtml = require('../node_modules/linkedin/example/jsonhtml')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

// the api call to display
LinkedInUri = '/people/~/connections:(first-name,last-name,id)'

// get our configuration
var defaults = haraldops.defaults(__filename + 'on')
defaults.authorize_callback = defaults.hostUrl + defaults.completedUri

// launch our server so we can display things to the user
// and receive redirects from LinkedIn after authoriztion
var app = express.createServer()
var port = utils.getPort(defaults.hostUrl)
app.get(defaults.authenticateUri, authenticateHandler)
app.get(defaults.completedUri, expressCompletedHandler)
app.listen(port)

// authorize the web application for the user
var client = linkedin.getApiClient(defaults)
if (!client) throw Error('linkedin api client is missing parameters')

// here you could apply previously obtained credential for this user
var obj = loadCredentials()
if (obj) client.applyAccessCredentials(obj)

// if we have credentials, jump to the api
if (client.hasAccess()) {
	console.log('Have credentials')
	utils.browseTo(defaults.authorize_callback)
} else {
	// otherwise, authorize the LinkedIn web app first
	client.authorize(function(err, url) {
		if (err) console.log('Error when retrieving request token from LinkedIn:', err)
		else utils.browseTo(url)
	})
}

// invoked by server when our url is requested, server extects json
// for requests to the redirect after authorizing, process and obtain Oauth access token
function completedHandler(queryObject, callback) {
	// for requests to the redirect after authorizing, process and obtain Oauth access token
	client.handleAuthorizing(queryObject, function(err, possibleAccessCredentials) {
		// some error trying to get access tokens
		if (err) callback(err, null)
		else {
			if (possibleAccessCredentials) {
				console.log('cred', possibleAccessCredentials)
				// we just successfully obtained Oauth access tokens, save them
				// typically they last forever
				fs.writeFileSync(
					haraldops.defaults.getHomeFolder() + '/linkedinaccess.json',
					JSON.stringify(possibleAccessCredentials))
			}

			// render some final data to the user
			if (!client.hasAccess()) {
				var json = ({ issue: 'You have not authorized this application' })
				callback(null, json)
			} else doApi(callback)
		}
	})
}

// we are authorized and want to display something in json format
function doApi(callback) {
	//getJonathanCobb(useConnection)
	//getJonathan2()
	getSearchJonathan2()

	function getSearchJonathan2() {
		var query = {
			// does not work: &distance=2
			uri: '/people-search:(people:(first-name,last-name,id,distance,connections),num-results)?first-name=Jonathan',
			filter: {
				distance: 2,
			},
			multiples: 'all',
		}
		pagedSearch(query)
	}

	// does not work: connections only return distance 1
	function getJonathan2() {
		var query = {
			uri: '/people/~/connections:(first-name,last-name,id,distance)',
			filter: {
				firstName: 'Jonathan',
				//distance: 2,
			},
			multiples: 'all',
		}
		apiSearch(query)
	}

	function getJonathanCobb(next) {
		var query = {
			uri: '/people/~/connections:(first-name,last-name,id,distance)',
			filter: {
				firstName: 'Jonathan',
				lastName: 'Cobb',
			},
		}
		apiSearch(query, next)
	}

	function useConnection(value) {
		console.log(JSON.stringify(value))
		getFriendsOfFriend(value.id)
	}

	// not allowed, gives 403
	function getFriendsOfFriend(id, next) {
		var argumentsArray = Array.prototype.slice.call(arguments)
		var uri = '/people/id=' + id + '/connections:(first-name,last-name,id)'
		client.api(uri, function(err, json) {
			if (err || !next) callback(err, json)
			else callback(err, json)
		})
		// {"statusCode":403,
		//	"data":"{\n  \"errorCode\": 0,\n  \"message\": \"Access to other member's connections denied\",\n  \"requestId\": \"NUPP9KGPQM\",\n  \"status\": 403,\n  \"timestamp\": 1334991581842\n}"}
	}

	
	function pagedSearch(query, next) {
		var argumentsArray = Array.prototype.slice.call(arguments)
		var result = []
		var c = {
			// concurrent requests
			max: 5,
			// key: first item requested, value: don't care
			pending: {},

			// fetch control
			pageSize: 25,
			nextToFetch: 0,
			maxToFetch: -1,
			// key: first item, value: people array
			received: {},

			// processing control
			nextToProcess: 0,

			cancelled: false,
		}

		fetch()

		// sample responses
		// {"numResults":336209,
		// 	"people":
		//	{"_count":1,"_start":0,"_total":100,"values":[{"connections":{"_total":403},"distance":1,"firstName":"Jonathan (Sian)","id":"NBMgM6TPyf","lastName":"Liu"}]}}
		//
		// { numResults: 336217, people: { _start: 100, _total: 100 } }


		function fetch() {
			if (!c.cancelled) {
				if (c.maxToFetch == -1 || c.nextToFetch < c.maxToFetch) {
					var myFirst = c.nextToFetch
					c.nextToFetch += c.pageSize
					var url = query.uri + '&start=' + myFirst + '&count=' + c.pageSize
					console.log('submit:', myFirst)
					c.pending[myFirst] = true
					client.api(url, function(err, json) {
						delete c.pending[myFirst]
						if (err) {
							c.cancelled = true
							callback(err, json)
						} else if (!c.cancelled) {
							// did we get people object?
							if (json && json.people) {

								// update max
								if (c.maxToFetch == -1) {
									var total = json.people._total
									if (total) c.maxToFetch = total
								}

								// how many did we get
								var count = 0
								var values = json.people.values
								if (Array.isArray(values)) count = values.length
								if (count < c.pageSize && // we did not get a full page
									myFirst + count < c.maxToFetch) { // and not at end
									var err = Error('didnotgetfullpage:' + myFirst + ',' +
										count + ',' +
										JSON.stringify(json))
									c.cancelled = true
									callback(err, json)
								}

								// we know there is one pending slot availabke
								console.log('inner recursion')
								fetch()

								// forward to processing
								if (count > 0) {
									c.received[myFirst] = values
									if (c.nextToProcess == myFirst) process()
								}

								// there will be at least one request
								// we either got an error or get here
								if (Object.keys(c.pending).length == 0) {
									// there are no more requests
									// if there was no data, go complete
									if (c.maxToFetch == -1) {
										// we never got a total
										var err = Error('got no total:' + myFirst +
											JSON.stringify(json))
										c.cancelled = true
										callback(err, json)
									} else if (c.maxToFetch == 0) {
										// there was no data at all
										complete()
									}
								}

							} else {
								var err = Error('didnotgetpeople:' + myFirst +
									JSON.stringify(json))
								c.cancelled = true
								callback(err, json)
							}
						}
					})
					// after submitting a request, submit another one to capacity
					console.log('outer recursion')
					if (Object.keys(c.pending).length < c.max) fetch()
				}
			}
		} // submit
	var maxD = 0

		// entered whenever data added to an empty buffer
		function process() {
			console.log('process')
			while (true) {
				// get the data
				var myFirst = c.nextToProcess
				var values = c.received[myFirst]
				if (!values) break

				// process the items
				console.log('processing:', myFirst, values.length)
				values.forEach(function(value) {
					if (value.distance > maxD) maxD = value.distance
					if (matchWithFilter(query.filter, value))
						result.push(value)
				})

				// drop the data
				delete c.received[myFirst]
				c.nextToProcess += values.length
			}
			if (c.maxToFetch != -1 && c.nextToProcess == c.maxToFetch) {
				complete()
			}
		}

		function complete() {
			console.log('complete', maxD)
			callback(null, result)
		}
	}

	function apiSearch(query, next) {
		var argumentsArray = Array.prototype.slice.call(arguments)
		client.api(query.uri, function(err, json) {
			if (err) callback(err, json)
			else {
				console.log(JSON.stringify(json))
				var valueArray = json.values || json.people.values
				console.log('apiHits:', valueArray.length)
				if (valueArray.length == 0) {
					// there were no hits
					callback(err, { 'nomatch': query })
				} else {
					// we now have an array of 1 or more objects
					var multiples = query.multiples == 'all'
					if (!query.filter) {
						// return first or all
						if (multiples) result = valueArray
						else result = valueArray[0]
					} else {
						// apply filter
						var result = multiples ? [] : undefined
						valueArray.some(function(value) {
							var match = true
							var filter = query.filter
							for (var property in filter) {
								if (value[property] != filter[property]) {
									match = false
									break
								}
							}
							if (match) {
								if (multiples) {
									result.push(value)
									match = false
								} else result = value
							}
							return match
						})

						// matching results now in result
						console.log('matches:', multiples ? result.length : result != undefined)
						if (!result) {
							callback(err, { 'nomatch': query })
						}
					}

					// we know have something in result
					if (!next) callback(err, result)
					else {
						argumentsArray.splice(0, 2, result)
						next.apply(this, argumentsArray)
					}
				}
			}
		})
	}

}

function matchWithFilter(filter, value) {
	var matches = true
	if (filter) for (var property in filter) {
		if (value[property] != filter[property]) {
			matches = false
			break
		}
	}
	return matches
}

function authenticateHandler(callback) {
	client.clearAccess()
	client.authorize(callback)
}

function expressCompletedHandler(req, res, next) {
	completedHandler(req.query, function(err, data) {
		if (err) expressWriteErr(err, res)
		else expressWriteHtml(data, res)
	})
}

function expressWriteErr(err, res) {
	var string = err instanceof Object ?
		err.message || JSON.stringify(err) :
		err.toString()
	res.writeHead(500, {"Content-Type": "text/plain"})
	res.end(string)
}

function expressWriteHtml(data, res) {
	res.writeHead(200, {"Content-Type": "text/html"})
	res.end(jsonhtml.jsonHtml(data, defaults.authenticateUri))
}

function expressWriteText(data, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' })
	res.end(data)
}

function loadCredentials() {
	var obj = undefined
	try {
		obj = haraldops.defaults('linkedinaccess')
	} catch(e) {
		var bad = true
		if (e instanceof Error) bad = false
		if (bad) throw e
	}
	//console.log('loadCredentials:', obj ? Object.keys(obj) : 'nothing')
	return obj
}
