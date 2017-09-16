// mongoserial.js

// issues:
// recursive object: runs out of stack space
// undefined becomes null: top.u
// object primitive becomes object:object: top.objprim
// function properties become undefined top.myobjs.f
// global function values become undefined top.ocon: Object
// error objects becomes empty object

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

// https://github.com/broofa/node-uuid
var uuid = require('./uuid').uuid

// how do I enforce unique id? by adding an index. This overwrites, not creating errors
// how do I replace a document rather than merge properties? use upsert option with findAndModify

// the easiest way to find unique item is findOne() using callback
// uuid are better than mongodb's id, because they can be moved between databases

// insert
// doc or doc array
// options: safe keepGoing, serializeFunctions
// safe and struct must have callback

// conclusions from mongodbconnect.js
var params = {
	connectUrl: 'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing',
	connectOpts: {},//{ssl: true},
	testCollection: 'test',
}

var db
var defaults

init(params, function(err) {
	if (err) throw err

	var c = db.collection(defaults.testCollection)

	// fixture: delete the test collection
	var funcs = [ drop, compare ]

	doNextFunc()
	function doNextFunc(err) {
		if (!err) {
			f = funcs.shift()
			if (f) f(c, doNextFunc)
			else shutDown()
		} else {
			shutDown(err)
		}
	}
})

function compare(c, cb) {
	var object = createObject()
	var objectSaved = createObject()
	console.log('two objects')
	deepEqual(object, objectSaved)
	c.insert(objectSaved, function (err, v) {
		if (err) cb(err)
		console.log('after insert')
		deepEqual(object, objectSaved)
		c.findOne({id:1}, function(err, objectRead) {
			if (err) cb(err)
			console.log('read object')
			deepEqual(objectSaved, objectRead)
			//console.log(objectSaved)
			//console.log(objectRead)
			cb()
		})
	})
}

function deepEqual(object1, object2) {
	innerEquals(object1, object2, 'top')

	function innerEquals(object1, object2, thisLevel) {
		var equal

		// do valueOf to get the true type of a primtive object
		var v1 = getTrueValue(object1)
		var v2 = getTrueValue(object2)
		var t1 = typeof v1
		var t2 = typeof v2

		if (t1 != 'object' || t2 != 'object') {
			// at least one primitive
			// ie. can immediately deteremine if there is a difference at this level
			if (t1 != t2 || // types are different
				(v1 != v2 &&	// or values are different
				(t1 != 'number' || !isNaN(v1) || t2 != 'number' || !isNaN(v2)))  // and they are not both NaN
				) {
				// there is a difference at this level in primitive value

				v1 = makePrintable(v1, t1)
				v2 = makePrintable(v2, t1)

				console.log(thisLevel + ':', v1, '<>', v2, ')')
			}
		} else {
			// they are both objects
			if (v1.constructor.name != v2.constructor.name) {
				console.log(thisLevel + '.constructor.name:',
					v1.constructor.name, '<>', v2.constructor.name, ')')	
			}

			// get the collection of enumerable properties
			var props = {}
			Object.keys(object1).forEach(function (prop) {
				props[prop] = true
			})
			Object.keys(object2).forEach(function (prop) {
				props[prop] = true
			})
			/*
			if (Object.keys(props).length == 0 && v1.constructor == Date) {
				// bloody dates
				var diff = datesDifferent(v1, v2)
				if (diff) {
					console.log(thisLevel, diff)
				}
			} else {*/
				for (var prop in props) {
					innerEquals(object1[prop], object2[prop], thisLevel + '.' + prop)
				}
			//}
		}
	}

	function datesDifferent(d1, d2) {
		var result = {}
		if (d1.valueOf() != d2.valueOf()) {
			result.v = d1.valueOf() + ' is not equal to ' + d2.valueOf()
		}
		if (d1.toISOString() != d2.toISOString()) {
			result.s = d1.toISOString() + ' is not equal to ' + d2.toISOString()
		}
		if (Object.keys(result).length == 0) result = undefined
		return result
	}
	// some objects are not really objects
	function getTrueValue(v) {
		if (v != null && typeof v == 'object') {
			// it is not null or undefined, but an object
			// it could be a primitive object
			// it could be a Date
			switch (v.constructor) {
			case Number:
			case Boolean:
			case String:
			case Date:
				v = v.valueOf()
			}
		}
		return v
	}

	// make v1 and v2 printable,
	// ie. don't print objects with lots of properties
	// don't print function code
	function makePrintable(v, t) {
		if (v != null) {
			// it is not null or undefined
			if (t == 'object') v = 'Object:' + v.constructor.name
			else if (t == 'function') v = 'function:' + (v.name || 'anonymous')
		}
		return v
	}
}
var myDate = new Date()
function createObject() {
	var ocycle = { }
	ocycle.recursive = ocycle

	var anO = { str: 'abc'}

	function MyObj() {
		this.f = compare
	}

	var object = {
		id: 1,
		u: undefined,
		n: null,
		b: false,
		n: 5,
		i: Infinity,
		imin: -Infinity,
		nan: NaN,
		s: '',
		objprim: Object(5),
		//recursive: ocycle,
		arr: [ 1 ],
		myobjs: new MyObj(),
		date: myDate,
		ocon: Object,
		regex: /a/,
		e: Error('hello'),
		an1: anO,
		an2: anO,
	}
	return object
}

function drop(c, cb) {
	c.drop()
	c.find().count(function(err, num) {
		if (!err) {
			if (num != 0) cb(Error('Dropped collection not empty'))
			else cb()
		} else cb(err)
	})
}

// closeDb with error logging
function shutDown(err) {
	if (err) console.log('error:', err)
	closeDb(function (err) {
		if (err) console.log('close error:', err)
		console.log('end of program')
	})
}

// receive defaults, open the database
function init(defaultsx, cb) {
	defaults = defaultsx
	if (!db) {
		mongodb.connect(defaults.connectUrl, defaults.connectOpts, function (err, dbx) {
			if (!err) {
				db = dbx
				if (cb) cb()
			} else {
				if (cb) cb(err)
				else throw err
			}
		})
	} else if (cb) cb()
}

function closeDb(cb) {
	if (db) {
		var aDb = db
		db = undefined
		aDb.close(function(err) {
			if (cb) cb(err)
			else if(err) console.log('close error:', err)
		})
	} else if (cb) cb(null)
}
