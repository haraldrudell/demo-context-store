// getfriends.js
// get data about friends

/*
120801 this was an old friends scanner
it writes to the filesystem
the code is broken, so it's unclear at what location
*/

var getFromFacebook = require('./getfromfacebook').getFromFacebook

exports.update = update

var getFriendsList = '/me/friends?fields=id'
var friendFields = '?email'

// update: readcurrent social network status, wirte new friends to database
// idMap: key: id, all ids currently in the database
// callback(err, result) final callback { lost: [], new: []}
// dbsave(item, callback())
function update(idMap, callback, dbsave) {
	var newIds = []
	var friendsListComplete = false

	// concurrency controller
	var c = {
		max: 5,
		buffer: [],
		pending: 0,
		cancelled: false,
	}

	getFromFacebook(getFriendsList, processFriendId)

	// invoked for each id of the social network's friendslist
	// return value: wether to continue
	function processFriendId(error, item) {
		if (!c.cancelled) {
			if (!error) {
				if (item) {
					if (idMap[item.id]) { // known friend
						// remove from list of known friends
						delete idMap[item.id]
					} else { // new friend
						newIds.push(item.id)
						getNewFriend(item.id)
					}
				} else { // reached the end
					// all friend ids have been retrieved
					friendsListComplete = true
					if (c.pending == 0) returnResult()
				}
			} else {
				c.cancelled = true
				callback(error)
			}
		}
		return !c.cancelled
	}

	function getNewFriend(id) {
		if (c.pending >= c.max) c.buffer.push(id)
		else {
			c.pending++
			getFromFacebook('/' + id + friendFields, function(err, item) {
				if (!c.cancelled) {
					if (!err) {
						dbsave(item, function(err, data) {
							if (!c.cancelled) {
								if (!err) {
									c.pending--
									if (c.buffer.length) {
										getNewFriend(c.buffer.shift())
									} else if (c.pending == 0 && friendsListComplete) {
										returnResult()
									}
								} else {
									c.cancelled = true
									callback(err, null)														
								}
							}
						})
					} else {
						c.cancelled = true
						callback(err, null)
					}
				}
			})
		}
	}

	function returnResult() {
		callback(null, { lost: Object.keys(idMap), new: newIds})
	}

}

function getFriends() {
	var hasNew = false
	var pending = 0
	var keepGoing = true
	var friendsDone = false

	// { id:name }
	var friends = readFriendsFile(friendsFile)
	var unFriends = cloneFriends(friends)
	var initialCount = Object.keys(friends).length

	getFromFacebook('/me/friends?fields=id,username,email,timezone', processFriendObject)

	// process { name:, id: }
	function processFriendObject(error, item) {
		if (error) console.log('callback:error:', error)
		else if (item) {
			console.log('processFriendObject', item)
			var isNew = !friends.hasOwnProperty(item.id)
			if (isNew) {
				hasNew = true
				addFriend(item.id, item.username)
			} else {
				delete unFriends[item.id]
			}
		}
		if (error || item == null) {
			friendsDone = true
			if (!pending) allDone()
		}
		return false//keepGoing
	}

	function addFriend(id, name) {
		if (!name) name = id
		friends[id] = name
		pending++
		fbrq('/' + id, function (error, data) {
			pending--
			if (!error) {
				var str = JSON.stringify(data)
				fs.writeFileSync(folder + '/' + name, str)
				if (friendsDone && pending == 0) allDone()
			}
			if (error) {
				console.log(error)
				keepGoing = false
			}
		})
	}

	function allDone() {
		console.log('unfriends:', unFriends)
		var friendsNow = Object.keys(friends).length
		var str = friendsNow.toString()
		if (hasNew) {
			var added = friendsNow - initialCount
			if (added > 0) str +=  '+'
			str += added
		}
		console.log('friends:', str)
		writeFriendsFile(friendsFile, friends)
	}

}

function cloneFriends(friends) {
	var newFriends = {}
	for (property in friends) newFriends[property] = friends.property
	return newFriends
}

function readFriendsFile(filename) {
	var result = {}
	try {
		var data = fs.readFileSync(filename)
		var friendsBefore = eval('(' + data.toString() + ')')
		if (friendsBefore == null || typeof friendsBefore != 'object') {
			throw Error('friends file data corrupt')
		}
		result = friendsBefore
	} catch (e) {
		if (e == null || !(e instanceof Error) || e.code != 'ENOENT') throw e
	}

	return result
}

function writeFriendsFile(filename, data) {
	var str = JSON.stringify(data)
	//fs.writeFileSync(filename, str)
}

