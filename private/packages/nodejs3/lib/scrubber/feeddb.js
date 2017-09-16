// feeddb.js
// get all active records for a sourceName
// © Harald Rudell 2012 MIT License

var scrapemanager = require('./scrapemanager')

exports.getFeedDb = getFeedDb

/*
Fetch active records from the database

a. retrieve feed entries
b. filter each feed entry for title
c. match feed entry against database to determine if it is new
d. read database and verify each url to determine if still active

timer:
find minimum, average and maximum processing time
provide timeout monitor for each request
future: input buffer

https://tas-yahoo.taleo.net/careersection/feed/joblist.rss?lang=en&portal=8140453570&searchtype=1&location=197740453570
https://capitalone.taleo.net/careersection/feed/joblist.rss?lang=en&portal=101430233&searchtype=1
https://capitalone.taleo.net/careersection/usx/jobdetail.ftl?job=241660


https://capitalone.taleo.net/careersection/usx/jobsearch.ftl?lang=en&portal=101430233 US salaried positions

https://capitalone.taleo.net/careersection/usx/joblist.ftl#
input: data.sourceName
output: data.map: key: id, value: object
function getFeedDb() {
	var self = feedDb
	var c = scrapemanager.getCollection()
	return self
	function feedDb(data) {
		if (data) {
			c.find({sourceName:data.sourceName, lastSeen: {$exists:true}},
				).each(function (err, doc) {
				if (!err) {

				}
			})

		} else {
			self.complete(self.id)
			self.output()
		}
	}
}
*/