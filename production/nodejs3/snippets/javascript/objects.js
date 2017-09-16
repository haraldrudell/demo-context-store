// objects.js
// 15.2.1 Object objects

/*
var pid = 1
var f = function () {}
//var appState = {killFn: {1: f}} //works
//var appState = {killFn: null} //TypeError: Cannot convert null to object
//var appState = {killFn: null} //TypeError: Cannot convert null to object
//var appState = {} // TypeError: Cannot convert null to object
var appState = null
delete appState.killFn[pid]
return
*/
var inspect = require('haraldutil').inspect

console.log('getByPrototype:')
console.log('1.', getByPrototype()) // undefined
console.log('2.', getByPrototype( { b: { c: 2 } })) // two-level object
console.log('3.', getByPrototype(inspect)) // function
console.log('4.', getByPrototype(SyntaxError(3))) // non-enumerable properties
console.log('End of getByPrototype')

console.log(inspect(Object(5).valueOf()))
var object = { a: 1, b: 2 }
console.log(inspect(object.valueOf()))
console.log(object.valueOf() == object)
var object = Object(5)
console.log(object.valueOf() == object)

// print objects by prototype
function getByPrototype(value) {
	var level = 0
	var spacing = '  '

	// null or undefined
	return objectPrototypeChain(value)

	// put objects by prototype in string
	function objectPrototypeChain(object) {
		var result = ''

		var type = typeof object
		if (type != 'object') {
			// null and undefined
			result += inspect(object)
		} else {
			// object:name
			result += type + ':' + object.constructor.name

			// the object's properties indented one level
			level ++

			// first print enumerable properties, then non-enumerable properties
			Array(false, true).forEach(function (enumerable) {
				Object.getOwnPropertyNames(object).forEach(function (property) {
					if (enumerable == Object.propertyIsEnumerable.call(object, property)) {
						var value = object[property]
						result += '\n' + indent() + property + ': ' + (!enumerable ? '(ne) ' : '') + objectPrototypeChain(value)
					}
				})
			})

			// next prototype
			var prototype = object.prototype
			if (prototype) pResult += 'prototype:' + objectPrototypeChain(prototype)

			level --
		}

		return result
	}

	function indent() {
		var result = ''
		for (var a = 0; a < level; a++) result += spacing
		return result
	}
}

//	listProperties('enumerable properties:', e, Object.keys(e))
//	listProperties('other properties:', e, Object.getOwnPropertyNames(e), Object.keys(e))

var index = 6
var letter = 'a'
console.log(index + '. All values except undefined and null have .toString() and .valueOf().')

/*
6a. .valueOf() unwraps primitive objects.
6a1. Object(false): Object(false)
6a2. Object(false).valueOf(): false
6a3. ({}).valueOf(): {}
*/
console.log('\n' + index + letter + '. .valueOf() unwraps primitive objects.')
var subnumber = 1
Array(
	'Object(false)',
	'Object(false).valueOf()',
	'({}).valueOf()'
).forEach(function (e) {
	var value = eval(e)
	console.log(index + letter + subnumber + '.', e + ':', inspect(value))
	subnumber++
})

/*
6b. String(x) can handle undefined and null, as opposed to .toString()
6b1. String(undefined): 'undefined'
6b2. String(null): 'null'
*/
letter = String.fromCharCode(letter.charCodeAt(0) + 1)
console.log('\n' + index + letter + '. String(x) can handle undefined and null, as opposed to .toString()')
var subnumber = 1
Array(
	'String(undefined)',
	'String(null)'
).forEach(function (e) {
	var value = eval(e)
	console.log(index + letter + subnumber + '.', e + ':', inspect(value))
	subnumber++
})

/*
6c. Plain objects typically don't print very well, while specific objects might
6c1. String({a: 2}): '[object Object]'
6c2. String(new Error("abc")): 'Error: abc'
*/
letter = String.fromCharCode(letter.charCodeAt(0) + 1)
console.log('\n' + index + letter + '. Plain objects don\'t print well, a defined toString() fixes that')
var subnumber = 1
Array(
	'String({a: 2})',
	'String(new Error("abc"))',
	'String({toString: function () {return "haha"}})'
).forEach(function (e) {
	var value = eval(e)
	console.log(index + letter + subnumber + '.', e + ':', inspect(value))
	subnumber++
})