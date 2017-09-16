// checkdb.js
// Examine record in the database
// © Harald Rudell 2012 MIT License

module.exports = {
	checkCollection: checkCollection,
}
var printAllRecords //= true
var printInactiveRecords //= true
var printMissingFirstSeenRecords = true
var printSeenOnceRecords// = true

var dropDatabase//= true

function checkCollection(c) {
	if (dropDatabase) c.drop()
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	console.log(func, 'starting')

	var dbStat = {
		records: 0,
		inactive: 0,
		active: 0,
		bothSawAndSeen: 0,
		missingFirstSeen: 0,
		missingLastSeen: 0,
		missigFields: 0,
		firstIsGreater: 0,
		seenOnce: 0,
	}
	var idMap = {}
	c.find().each(function (err, doc) {
		if (err) throw err
		if (doc) {
			if (printAllRecords) console.log(doc)
			dbStat.records++
			if (doc.lastSaw) {
				if (printInactiveRecords) console.log(doc)
				dbStat.inactive++
				if (doc.lastSeen) dbStat.bothSawAndSeen++
			} else {
				dbStat.active++
				if (!doc.firstSeen) {
					if (printMissingFirstSeenRecords) console.log(doc)
					dbStat.missingFirstSeen++
				} else if (!doc.lastSeen) dbStat.missingLastSeen++
				else {
					if (!doc.title || !doc.url || !doc._id || !doc.name) dbStat.missigFields++
					else if (doc.firstSeen > doc.lastSeen) dbStat.firstIsGreater++
					else if(doc.firstSeen == doc.lastSeen) {
						if (printSeenOnceRecords) console.log(doc)
						dbStat.seenOnce++
					}
				}
			}
		} else {
			console.log(func, 'complete:', dbStat)
		}
	})
}