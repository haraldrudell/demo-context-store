// logprofile.js
// log a fb profile from the database
// © Harald Rudell 2012

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

exports.logProfile = logProfile

function logProfile(id, mongo, emitter) {
	// get and print a person
	mongo.find({id: '665798792'}, // query
		{}, // options
		gotDudeCursor)

	function gotDudeCursor(err, cursor) {
		if (!err) cursor.toArray(gotDude)
		else emitter.emit('error', err, {loc: arguments.callee.name, cursor: cursor})
	}

	function gotDude(err, arr) {
		if (!err) console.log(arguments.callee.name, haraldutil.inspectDeep(arr))
		else emitter.emit('error', err, {loc: arguments.callee.name, arr: arr})
	}
}