// test-mongo.js

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

var jobstore = {
	"dbUrl": "mongodb://harald:aabbcc@ds031607.mongolab.com:31607/harald",
	"dbOpts": {
		"ssl": true
	},
	"collection": "test",
}

var db
var c

module.exports = {
	tests: {
		testFindAndModify: testFindAndModify,
	},
	setUp: setUp,
	tearDown: tearDown,
}
var states = {
	initial: [
		{ _id: '1', name: 'a', same: 's'},
		{ _id: '2', name: 'b', same: 's'},
	],
	overwrite: [
		{ _id: '1', lastname: 'c'},
		{ _id: '2', name: 'b', same: 's'},
	],
	overwriteAndId: [
		{ _id: '1', lastname: 'd'},
		{ _id: '2', name: 'b', same: 's'},
	],
}
var queries = [
	{ _id: '1' },
	{ same: 's' },
]
var opts = [
	{safe:true},
	{upsert:true,safe:true},
]
var updates = [
	{ lastname: 'c' },
	{ _id: '1', lastname: 'd'},
//	{$set:{lastname: 'c'}},
]
var sort = []
var expected = [
	states.initial,
]
function testFindAndModify(test) {
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	console.log(func, 'starting')

	var testNo = -1
	nextTest()

	function nextTest() {
		if (++testNo < updates.length * queries.length * opts.length) {
			q = queries[testNo % queries.length]
			o = opts[Math.floor(testNo / queries.length) % opts.length]
			u = updates[Math.floor(testNo / queries.length / opts.length)]
			doMongo(q, o, u)
		} else {
			console.log(func, 'complete')
			test.done()
		}
	}

	function doMongo(q, o, u) {
		resetDb()

		function doTest() {
			c.findAndModify(dc(q), sort, dc(u), dc(o), function famcb(err, v1, v2) {
				var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
				if (err) throw err
				c.find().toArray(function (err, docArray) {
					if (err) throw err
					var state
					for (var stateName in states) {
						if (de(docArray, states[stateName])) {
							state = stateName
							break
						}
					}
					if (!state) {
						console.log(func, 'operation:', q, u, o)
						console.log('Unknown state:' + JSON.stringify(docArray))
						throw Error('bad!')
					}
					//test.equal(state, expected[testNo])
					console.log(func, 'operation:', q, u, o)
					console.log(func, testNo, state)
					nextTest()
				})
			})
		}
		
		function resetDb() {
			// 120613 documentation says [callback], but callback is not invoked
			c.drop()
			c.insert(states.initial, {safe:true}, function(err, v) {
				if (err) throw err
				doTest()
			})
		}
	}

	function de(o1, o2) {
		if (o1 != null && typeof o1.valueOf() == 'number' && isNaN(o1) &&
			o2 != null && typeof o2.valueOf() == 'number'  && isNaN(o2)) return true
		if (o1 === o2) return true
		if (o1 != null && typeof o1 == 'object' &&
			o2 != null && typeof o2 == 'object' &&
			Object.keys(o1).length == Object.keys(o2).length) {
			for (var p in o1) {
				if (!de(o1[p], o2[p])) return false
			}
			return true
		}
		return false
	}
	function dc(o) {
		var result = {}
		for (var p in o) {
			var v = o[p]
			if (v != null && typeof v == 'object') v = dc(v)
			result[p] = v
		}
		return result
	}

}

function setUp(cb) {
	mongodb.connect(jobstore.dbUrl, jobstore.dbOpts, function (err, dbx) {
		if (err) throw err
		db = dbx
		c = db.collection(jobstore.collection)
		cb()
	})
}

function tearDown(cb) {
	if (db) {
		aDb = db
		db = undefined
		aDb.close(function(err) {
			if (err) throw err
			cb()
		})
	} else cb()
}
