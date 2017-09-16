// mergeproperties.js

console.log(merge({ a:1}, {b:2}))

// return an object with the properties of all provided objects
function merge() {
	var result = {}
	for (index in arguments) {
		var obj = arguments[index]
		for (property in obj) {
			result[property] = obj[property]
		}
	}
	return result
}
