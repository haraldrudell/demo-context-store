// cloudc.js
// test {pk:uuid}
// test find with $set and upsert

var uuid = require('./uuid')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var defaults = {
	funcs: [
		reset,
		displayState,
		firstRecord,
		displayState,
		secondRecord,
		displayState,
	],
	dbOpts: {pk:myPk},
}

var c

var dbo = require('./mongohelper').get(defaults)
dbo.start()

function reset(cb) {
	dbo.setState([], verify)

	function verify(err, c0) {
		if (!err) c = c0
		cb(err)
	}

}
function displayState(cb) {
	dbo.getState(getResult)

	function getResult(err, array) {
	 	if (!err) console.log(arguments.callee.name, array)
		cb(err)
	}
}

function firstRecord(cb) {

	var o = {
		id:10,
		o1: {value: 12},
		o2: {value: 10},
		created: 1,
	}
	var updated = 1

	c.ensureIndex({id:1}, {unique: true}, indexResult)

	function indexResult(err, indexName) {
		if (!err) {
			console.log('indexName:', indexName)

			// there is no operation that both updates and inserts
			// try update first, then insert

			c.findAndModify(
				{id:o.id},
				[],
				{$set: {o1: o.o1, updated: updated}, safe: true},
				findResult)
		} else cb(err)

	}

	function findResult(err, v1, v2) {
		if (!err) {
			/*
			v1: null
			v2: {value:null, ok:1}
			*/
			console.log(arguments.callee.name,
				haraldutil.inspectDeep(v1),
				haraldutil.inspectDeep(v2))
			if (v1) cb()
			else c.insert(
				o,
				{safe: true},
				insertResult)

		} else cb(err)
	}

	function insertResult(err, v) {
		if (!err) {
			/*
			v: [{ id:10, _id:object:ObjectID {...}}]
			*/
			console.log(arguments.callee.name,
				haraldutil.inspect(v))
			/*
			insertResult 1:[{
			    _id:object:ObjectID {
			      _bsontype:'ObjectID',
			      id:'PB\u0012\u00ac\u009c\u00d7\u00faZ\u0005\u0000\u0000\u0001',
			      -- prototype:ObjectID,
			      (get)generationTime:[getter Exception:TypeError: Cannot call method 'substring' of undefined],
			      toHexString:function (),
			      getInc:function (),
			      getTimestamp:function (),
			      inspect:function (),
			      generate:function (time),
			      toString:recursive-object#7,
			      get_inc:function (),
			      toJSON:function (),
			      equals:function equals(otherID)
			    },
			    id:10
			  }, (nonE)length:1]
			*/
		}
		cb(err)
	}
}

function secondRecord(cb) {
	var o = {
		id:10,
		o1: {value: 14},
		o2: {value: 10},
		created: 2,
	}
	var updated = 2

	c.findAndModify(
		{id:o.id},
		[],
		{$set: {o1: o.o1, updated: updated}},
		secondResult)

	/*
	c.insert(
		{id:o.id},
		{$set: {o1: o.o1, updated: updated}, upsert: true, safe: true},
		secondResult)
	*/

	function secondResult(err, v1, v2) {
		if (!err) {
			/*
			secondResult
			v1: {id:10,
			  _id:object:ObjectID {
			    _bsontype:'ObjectID',
			    id:'PB\u0015v\u0001\u00bc\u00e9\u00a7\u0005\u0000\u0000\u0001'
			  }
			v2: {
			  lastErrorObject:{
			    updatedExisting:true,
			    n:1,
			    lastOp:object:Long {...},
			    connectionId:855064,
			    err:null,
			    ok:1
			  },
			  value:{
			    id:10,
			    _id:object:ObjectID {...}
			  },
			  ok:1
			}
			*/
			console.log(arguments.callee.name,
				haraldutil.inspect(v1),
				haraldutil.inspect(v2))

		} else throw err
		cb(err)
	}

	function secondsResult(err, v1, v2) {
		if (!err) {
			console.log(arguments.callee.name,
				haraldutil.inspectDeep(v1),
				haraldutil.inspectDeep(v2))
		}
		cb(err)
	}
}

function myPk() {
	var result = uuid.uuid()
console.log(arguments.callee.name, result)
	return result
}