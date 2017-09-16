// scanner.js
// send email
//var mailer = require('./mailsend')
var monger = require('./monger')
var haraldutil = require('haraldutil')
var getfriends = require('./getfriends')

var dataSources = {
	'fb': { id:'775861653', update:getfriends.update},
	//'linkedin': { id:5, token: 6},
}

if (typeof require == 'object' &&
	typeof module == 'object' &&
	require.main === module) {
	// We are in node.js executing from the command line
	doObject(dataSources)
}

function doObject(object) {
	var items = Object.keys(object)
	var itemIndex = 0
	var processing = 0

	monger.open(function(err) {
		if (err) haraldutil.logError(err, 'Open database')
		else doNextKey()
	}, console.log)

	function doNextKey() {
		if (itemIndex < items.length) {
			processing++
			var itemName = items[itemIndex++]
			var item = object[itemName]
			var sourceId = item.id
			var collection = itemName + '-' + item.id
			var calls = [
				//doLogAll,
				doGetIds,
				updateService,
				emailing,
				//doDelete,
				doKeyEnd]
			var sharedIds
			var lostIds

			console.log('collection:', collection)
			call = calls.shift()
			call(calls)

			// print the state of the database
			function doLogAll(callbacks) {
				monger.logAll(collection, function(err, ids) {
					var call
					if (!err) call = callbacks.shift()
					else {
						haraldutil.logError(err, 'Failed to get All')
						call = callbacks.pop()
					}
					call(callbacks)
				}, console.log)	
			}

			// retrieve a map of the ids for known friends
			function doGetIds(callbacks) {
				monger.getIds(collection, function(err, ids) {
					var call
					if (!err) {
						console.log('known friends:', Object.keys(ids).length)
						sharedIds = ids
						call = callbacks.shift()
					} else {
						haraldutil.logError(err, 'Failed to get item list for:' + itemName)
						call = callbacks.pop()
					}
					call(callbacks)
				})
			}

			// match idMap with the social network's current content
			function updateService(callbacks) {
				var ids = sharedIds
				sharedIds = undefined
				item.update(ids, function(err, result) {
					var call
					if (!err) {
						console.log(
							'lost:', result.lost.length,
							'new:', result.new.length)
						lostIds = result.lost
						call = callbacks.shift()
					} else {
						haraldutil.logError(err, 'Failed to update:' + itemName)
						call = callbacks.pop()
					}
					call(callbacks)
				}, updateItem)

			}

			function updateItem(item, callback) {
				monger.writeItem(collection, item, callback)
			}

			function emailing(callbacks) {
				var body = '';
				var id
				update()

				function update() {
					id = lostIds.length ? lostIds.shift() : null
					if (!id) { // good exit
						if (body.length) {
							mailer.sendMail(
								'Unfriending' + itemName,
								body)
						}
						var call = callbacks.shift()
						call(callbacks)
					} else {
						console.log('set-to-unfriended:', id)
						monger.updateId(collection, id, {$set: {unfriended: true}},
							function(err, item) {
								if (!err) {
									body += "id:" +id + ": " + item.name + '\n'
									update()
								}
								else {
									haraldutil.logError(err, 'Failed to update:' + id)
									var call = callbacks.pop()
									call()
								}
						})
					}
				}

			}

			function doDelete(callbacks) {
				monger.deleteId(collection, 99, function(err, ids) {
					var call
					if (!err) {
						console.log('delete ok', ids)
						call = callbacks.shift()
					} else {
						haraldutil.logError(err, 'Failed to delete:' + id)
						call = callbacks.pop()
					}
					call(callbacks)						
				})
				//write(collection, { id:99, id2: 5, name:'Harald'})
				
			}

			function doKeyEnd() {
				processing--
				doNextKey()
			}

		} else {
			// a launch when no items remain
			if (processing == 0) end()
		}

	}

	function end() {
		mailer.closeMail()
		monger.close()
	}

}
