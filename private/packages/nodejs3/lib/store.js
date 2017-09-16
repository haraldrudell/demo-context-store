// store.js
// store and retrieve session keys
// © Harald Rudell 2012 MIT License

// imports
// http://nodejs.org/docs/latest/api/all.html#file_System
var fs = require('fs')

// exports
exports.get = getStore

function getStore(parameter) {
	// get store data
	var result = loadJson(parameter)
	if (!result) result = {}

	// merge in behavior
	result.save = save
	result.getNextId = getNextId

	return result

	function save(callback) {
		var jsonString = JSON.stringify(this)
		fs.writeFile(parameter, jsonString, function (err) {
			if (err) console.log('store.save:', err)
			if (callback) callback(err)
		})
	}

	function getNextId() {
		var nextId = 0
		if (this.nextId) nextId = this.nextId
		nextId++
		this.nextId = nextId
		return nextId
	}
}

// try to load json from the specified path
// throws exception on syntax problem in a found file
// return value: object or false if file was not found
function loadJson(path) {
	var result = false
	try {
		result = JSON.parse(fs.readFileSync(path))
	} catch (e) {
		var bad = true

		// ignore if file not found
		if (e instanceof Error  && e.code == 'ENOENT') bad = false

		if (bad) {
			// special message if syntax error in json
			var syntax = e instanceof SyntaxError
			if (syntax) e = SyntaxError('Bad syntax in property file:' + path + '\n' + e)

			throw(e)
		}
	}
	return result
}
