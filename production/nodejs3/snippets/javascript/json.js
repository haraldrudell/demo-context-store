// json.js
// demonstrate difficulties for json

// imports
var inspect = require('../projects/haraldutil/inspect')

// http://nodejs.org/api/path.html
var path = require('path')

console.log('\n\n\n===',
	path.basename(__filename,
		path.extname(__filename)))

console.log('Examining json' +
	' (JavaScript object notation)\n' +
	' extension: .json\n' +
	' mime type: application/json\n' +
	' homepage: http://www.json.org/)')
console.log('Json datatypes: Number String Boolean Array Object')
console.log('JavaScript global functions: JSON.parse(), JSON.stringify()\n')

console.log('Json syntax problems:')
try {
	JSON.parse('{ "abc" }')
} catch (e) {
	console.log('JSON.parse("{ 5 }") throws a ' + e.constructor.name + ' exception')
	console.log('message is:\'' + e.message + '\'')
}
// undefined
// +Infinity
// -Infinity
// recursive references in array values or object properties
// multiple references to the same object leads to multiple instances of the object
// Date
// Function or built-in objects

var o = {
	undefined: undefined,
	null: null,
	Infinity: Infinity,
	NaN: NaN,
	date: new Date(1335129582000),
	function: function() {},
	json: JSON,
}
// add recursion
o.o = o

console.log(inspect(o))

// avoid JSON throwing exception for recursion
delete o.o

var primObj = {
	undefined: Object(undefined),
	null: Object(null),
	boolean: Object(true),
	number: Object(5),
	Infinity: Object(Infinity),
	NaN: Object(NaN),
	string: Object('a'),
	date: Object(new Date(1335129582000)),
	function: Object(function() {}),
	json: Object(JSON),
}
console.log('primObj:', inspect(primObj))

var oo = JSON.parse(JSON.stringify(o))
console.log(inspect(oo))
if (isFinite(oo.Infinity)) console.log('JSON issue: Infinity becomes:', typeof oo.Infinity, oo.Infinity)
