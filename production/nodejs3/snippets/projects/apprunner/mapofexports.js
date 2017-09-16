// mapofexports.js
// Map settings and apis by exports value
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
*/

var jsutil = require('../../javascript/jsutil')

var p = jsutil.p
var pEval = jsutil.pEval

function Map() {
	this.add = add
	this.getByName = getByName
	this.getByObject = getByObject
	this.reset = reset
	var objects = []
	var objectIndex = []
	var nameIndex = {}

	/*
	Add an entry to the map
	object: value to add to map
	indexObject: optional value: index value for object index
	name: optional string: index value for name index
	*/
	function add(object, indexObject, name) {
		var index = objects.length
		if (name !== undefined) name = String(name)

		if (indexObject !== undefined) {
			if (~objectIndex.indexOf(indexObject)) {
				var s = 'indexObject not unique'
				if (name) s += ' "' + name + '"'
				throw new Error(s)
			}
		} else indexObject = null
		objectIndex.push(indexObject)

		if (typeof name === 'string') {
			if (typeof nameIndex[name] === 'string') throw new Error('name not unique: "' + name + '"')
			nameIndex[name] = index
		}

		objects.push(object)
	}

	/*
	Get value using name index
	name: string
	return value: map value or undefined if not found
	*/
	function getByName(name) {
		var result
		var index = nameIndex[name]
		if (index != null) result = objects[index]
		return result
	}
	/*
	Get value using object index
	object: index value in object index
	return value: map value or undefined if not found
	*/
	function getByObject(object) {
		var result
		var index = objectIndex.indexOf(object)
		if (~index) result = objects[index]
		return result
	}
	function reset() {
		objects = []
		objectIndex = []
		nameIndex = {}
	}
}
