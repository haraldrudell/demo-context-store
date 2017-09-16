// types.js

/* some tests for the debugger
var o = new Object()
var oc = new function C() {}
var f = function f(a) {}

// does Array costructor and push honor undefined? yes
var a = new Array(1, undefined, 2)
var aa = []
aa.push(1, undefined, 2)
var aaa = []
aaa.push(1, 2)
console.log(a, aa, aaa)
*/

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')

console.log('\n\n=== ', path.basename(__filename))

// 1..6
console.log('JavaScript has six language types')
examineValue('undefined type', undefined)
examineValue('null type', null)
examineValue('boolean type', true)
examineValue('number type', 1)
examineValue('string type', '\'abc\'')
examineValue('object type', {})

// 7..
examineValue('Simple object',new Object())
examineValue('Object from constructor',new function C() {})
examineValue('object with property', {property: 1})
examineValue('object with property', 'var e = {zfirst: 1, asecond: 2}; e[2] = 3; e[1] = 4, e[-1] = 5, e[0] = 6, e[1.5] = 7; e')
examineValue('object undefined and null properties', {undef: undefined, nu: null})
examineValue('array object', [])
examineValue('function object', function name(a) {})
examineValue('date object', 'new Date(0)')
examineValue('date object', 'new Date(2013, 2, 2)')
examineValue('regExp object', /a/)
examineValue('Error object', new Error('message'))
examineValue('Wrapped undefined', 'Object(undefined)')
examineValue('Wrapped null', 'Object(null)')
examineValue('Wrapped primitive', 'Object(true)')

function SubClass() {
	this.subClassProperty = 2
	Class.apply(this) // to get Class properties we have to invoke its constructor
}
function Class() {
	this.classProperty = 1
}
// util.inherits
SubClass.super_ = Class;
SubClass.prototype = Object.create(Class.prototype, {
	constructor: {
		value: SubClass,
		enumerable: false,
		writable: true,
		configurable: true
	}
})
examineValue('Prototype chain', new SubClass)

/*
17. Properties access on boolean and number values:
bracket property access: undefined
dot property access: undefined
array property access undefined
*/
var number = 1
number['property'] = 2
number.prop = 3
number[2] = 4
tryAccess('boolean and number', number)

/*
18. Properties access on string values:
bracket property access: undefined
dot property access: undefined
array property access c
*/
var str = 'abc'
str['property'] = 2
str.prop = 3
str[2] = 4
tryAccess('string', str)

function tryAccess(heading, value) {
	console.log('\n' + ++typeNumber + '. Properties access on', heading, 'values:')
	console.log('bracket property access:', value['property'])
	console.log('dot property access:', value.prop)
	console.log('array property access', value[2])
}

console.log('\n=== Conclusions')
var conc = 1
console.log(conc++ + '. The six language types are: undefined, null, boolean, number, string and object.')
console.log(conc++ + '. The typeof operator determines what type a value is.')
console.log(conc++ + '. Properties can only be assigned if the value is object. The other five types are primitive values.')
console.log(conc++ + '. Object.keys() and Object.getOwnPropertyNames() require the value to be object.')
console.log(conc++ + '. Primitive values can be wrapped to become object using the Object() construct.')
console.log(conc++ + '. Wrapping of null or undefined becomes the empty object {}.')
console.log(conc++ + '. Strings can be read but not written using bracket property access.')
console.log(conc++ + '. Object.keys() and for are the same and only produce enumerable properties.')
console.log(conc++ + '. Object.hasOwnProperty() can be invoked on any value.')
console.log(conc++ + '. Object.getOwnPropertyNames() skips __proto__.')
console.log(conc++ + '. All objects has a single __proto__ property added that is a chain ending with a null value.')
console.log(conc++ + '. If an object was created using a constructor, its __proto__ property is an Object object with two properties: a constructor function and an Object object __proto__ which is the constructor\'s prototype.')
console.log(conc++ + '. All function values have arguments, caller, length, name and prototype.')
console.log(conc++ + '. The prototype value has two properties: __proto__ and a constructor function property.')
console.log(conc++ + '. The prototype chain ends with a contructor that has itself as prorotype.')
console.log(conc++ + '. Object.__proto__.constructor.prototype is again Object.')
console.log(conc++ + '. To find enumerable property count: v && typeof v === \'object\' ? Object.keys(v).length : 0.')
console.log(conc++ + '. for and Object.keys provide integer indices 0 or greater first, then remaining indices in order declared.')

var typeNumber = 0
function examineValue(heading, valueOrExpression) {
	var isExpression = typeof valueOrExpression === 'string'
	var value = isExpression ? eval(valueOrExpression) : valueOrExpression

	// heading and String(value)
	if (!typeNumber) typeNumber = 0
	var logArgs = ['\n' + ++typeNumber + '.']
	if (heading) logArgs.push(heading + ':')
	if (isExpression) logArgs.push('expression:', valueOrExpression)
	else logArgs.push(value)
	console.log.apply(this, logArgs)

	// typeof
	console.log('typeof:', typeof value)

	// constructor
	if (value == null) console.log('Can not have properties')
	else {
		if (value.valueOf) console.log('valueOf:', haraldutil.inspectAll(value.valueOf()))
		if (value.constructor) console.log('constructor:', haraldutil.inspect(value.constructor.name))
	}

	// instanceof Object
	console.log('instanceof Object:', value instanceof Object)

	// enumerable properties
	var objectKeys
	var hasObjectKeys
	try {
		objectKeys = Object.keys(value)
		hasObjectKeys = true
	} catch (e) {
		objectKeys = e.toString()
	}
	console.log('Object.keys():', objectKeys)

	// all properties
	var properties
	var propertyList
	try {
		propertyList = Object.getOwnPropertyNames(value)
	} catch(e) {
		properties = e.toString()
	}
	if (Array.isArray(propertyList)) {
		properties = []
		propertyList.forEach(function (propertyName) { // for each property of value
			var propertyData = []
			var propertyDescriptor = Object.getOwnPropertyDescriptor(value, propertyName)
			for (var descriptorField in propertyDescriptor) { // for each value in its descriptor
				propertyData.push([descriptorField, ': ', haraldutil.inspect(propertyDescriptor[descriptorField])].join(''))
			}
			properties.push([propertyName, '(', propertyData.join(', '), ')'].join(''))
		})
		properties = '[' + properties.join(', ') + ']'
	}
	console.log('Object.getOwnPropertyNames():', properties)

	// for result
	var props = []
	for (var p in value) props.push(p)
	console.log('for values:', props)

	// prototype chain
	// value.hasOwnProperty('__proto__') is always false
	if (value && value.__proto__ !== undefined) {
		var v = value
		var prototypes = []
		while (v && v.__proto__ !== undefined) {
			var v = v.__proto__
			var desc = v !== null ? typeof v : String(v)
			if (v && v.constructor && v.constructor.name) desc += ':' + v.constructor.name
			prototypes.push(desc)
		}
		console.log('Prototype chain:', prototypes)
	} else console.log('No prototype')
}

// if you do valueOf when you evaluate type, you cover both primitives and object primitives
// you do not want to use global constructors like String, because these could be redefined


function checkString(o) {
	console.log('value:', o)

	if (o != null && typeof o.valueOf() == 'string') console.log('string!')
}

