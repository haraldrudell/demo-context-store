// patchdb.js

exports.patch = patch

/*
Fix problems with database
coll: mongo collection

unique index: title, sourceName, firstSeen, id
sourceName: 'LinkUp'
title: 'Product Manager'
url: 'http://www.linkup.com/r/ee6acf40d9ff46ba67ba9bb2ba216c72a5ad'
id: 'prn.com'
firstSeen: 1360463124522
lastSeen: 1360463124522
_id: '1d52748c-5f9b-49ee-be4d-db6c3f682fd5'

retired:
lastSeen is missing
lastSaw is the last time the record was found

invoked from scrapemanager:indexResult
*/
function patch(coll) {
	require('haraldutil').p()
	printActiveRecordsByLastSeen(coll)
}

function printActiveRecordsByLastSeen(coll) {
	var cbCounter = 2
	var result = {}
	var err

	coll.find({lastSeen: {$exists: true}}, activeResult)
	end()

	function activeResult(e, cursor) {
		if (!e && !err) cursor.each(processRecord)
		else newErr(e)
	}

	function processRecord(e, doc) {
		if (!e && !err) {
			if (doc) {
				if (result[doc.lastSeen]) result[doc.lastSeen]++
				else result[doc.lastSeen] = 1
			} else end()
		} else newErr(e)
	}

	function newErr(e) {
		if (e) {
			require('haraldutil').p(e.stack || e.message || e)
			if (!err) {
				err = e
				end(err)
			}
		}
	}

	function end(err) {
		if (err || !--cbCounter) {
			require('haraldutil').p(err ? 'Failed' : 'Success!', result)
		}
	}
}

function deleteCreatedTodayReviveCreatedBeforeTodayRetiredToday(coll) {
	var cbCounter = 3
	var today = getToday()
	var result = {
		retired: 0,
		revived: 0,
		patched: 0,
	}
	var err

	coll.find({firstSeen: {$gte: today}, lastSeen: {$exists: false}, lastSaw: {$exists: false}}, corruptResult)
	coll.find({firstSeen: {$gte: today}, lastSaw: {$exists: false}}, createdTodayResult)
	coll.find({firstSeen: {$lt: today}, lastSaw: {$gte: today}}, createdBeforeTodayRetiredTodayResult)
	end()

	function corruptResult(e, cursor) {
		if (!e && !err) cursor.each(patchRecord)
		else newErr(e)
	}

	function patchRecord(e, doc) {
		if (!e && !err) {
			if (doc) {
				result.patched++ // there were no corrupt records
			} else end()
		} else newErr(e)
	}

	function createdTodayResult(e, cursor) {
		if (!e && !err) cursor.each(retireRecord)
		else newErr(e)
	}

	function retireRecord(e, doc) {
		if (!e && !err) {
			if (doc) {
				result.retired++
				cbCounter++
				doc.lastSaw = doc.lastSeen
				delete doc.lastSeen
				coll.findAndModify(
					{_id:doc._id}, // query
					[], // sort
					doc, // update object
					retireOneDone)
			} else end()
		} else newErr(e)
	}

	function retireOneDone(e) {
		if (!err && !e) end()
		else newErr(err)
	}

	function createdBeforeTodayRetiredTodayResult(e, cursor) {
		if (!e && !err) cursor.each(reviveRecord)
		else newErr(e)
	}

	function reviveRecord(e, doc) {
		if (!e && !err) {
			if (doc) {
				result.revived++
				cbCounter++
				doc.lastSeen = doc.lastSaw
				delete doc.lastSaw
				coll.findAndModify(
					{_id:doc._id}, // query
					[], // sort
					doc, // update object
					reviveOneDone)
			} else end()
		} else newErr(e)
	}

	function reviveOneDone(e) {
		if (!err && !e) end()
		else newErr(err)
	}

	function newErr(e) {
		if (e) {
			require('haraldutil').p(e.stack || e.message || e)
			if (!err) {
				err = e
				end(err)
			}
		}
	}

	function end(err) {
		if (err || !--cbCounter) {
			require('haraldutil').p(err ? 'Failed' : 'Success!', result)
		}
	}
}

function printCountCreatedBeforeTodayAndRetiredToday(coll) {
	var today = getToday()
	coll.find({firstSeen: {$lt: today}, lastSaw: {$gte: today}}, findResult)

	function findResult(err, cursor) {
		if (!err) cursor.count(countResult)
		else require('haraldutil').p(err.stack || err.message || err)
	}

	function countResult(err, count) {
		if (!err) require('haraldutil').p('records:', count)
		else require('haraldutil').p(err.stack || err.message || err)
	}
}

function printCountCreatedToday(coll) {
	coll.find({firstSeen: {$gte: getToday()}}, findResult)

	function findResult(err, cursor) {
		if (!err) cursor.count(countResult)
		else require('haraldutil').p(err.stack || err.message || err)
	}

	function countResult(err, count) {
		if (!err) require('haraldutil').p('records:', count)
		else require('haraldutil').p(err.stack || err.message || err)
	}
}

function printCountRetiredAndSeenToday(coll) {
	coll.find({lastSaw: {$gte: getToday()}}, findResult)

	function findResult(err, cursor) {
		if (!err) cursor.count(countResult)
		else require('haraldutil').p(err.stack || err.message || err)
	}

	function countResult(err, count) {
		if (!err) require('haraldutil').p('records:', count)
		else require('haraldutil').p(err.stack || err.message || err)
	}
}

function getToday() { // beginning of day, local timezone
	var now = new Date
	var d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	return d.getTime()
}

function printARecord(coll) {
	coll.findOne({firstSeen: {$exists: true}}, // query
		{sort: {firstSeen: -1}, limit: 1},
		findOneResult)

	function findOneResult(err, data) {
		if (!err) require('haraldutil').p(data)
		else require('haraldutil').p(err)
	}
}
