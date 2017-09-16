// number.js
// © Harald Rudell 2012

console.log('\n\n=== ' + __filename.substring(__filename.lastIndexOf('/') + 1))

console.log(NaN || 5)
var a = 5
a.b = 3
console.log(a.b)

var index = 1
var letter = 'a'
console.log('1. Use of NaN: caused by undefined, some strings and objects')
console.log('Comparisons always render false')
console.log('isNaN does convert first')
Array(
	'NaN < 1',
	'NaN > 1',
	'NaN == 1',
	'isNaN({})'
).forEach(function (e) {
	var value = eval(e)
	console.log(index + letter + '.', e, value)
	letter = String.fromCharCode(letter.charCodeAt(0) + 1)
})

console.log('1a. ')
var a
console.log('1a.', a < 1)
var b = NaN
console.log('1b.', a < 1)

// can number have properties?
// no: property assignment is ignored
var a = 5
a['p'] = 3
// number undefined
console.log('number property assignment is ignored:', typeof a, a.p)

// can object primitive number have properties?
var a = Object(5)
a['p'] = 3
// yes: object 3
console.log('primtive objects can have properties:', typeof a, a.p)

// can undefined have properties?
// no: TypeError: Cannot set property 'p' of undefined
/*
var c
c['p'] = 3
console.log(typeof c)
*/

// can null have properties?
// no: TypeError: Cannot set property 'p' of null
/*
var c = null
c['p'] = 3
console.log(typeof c)
*/

console.log('\n\n=== shift')
console.log('Bitwise operators use 32-bit integers')
console.log('Anything not a small enough integer becomes 0: undefined null Infinity large float object non-nuermic string')
/*
=== shift
Bitwise operators use 32-bit integers
Anything not a small enough integer becomes 0: undefined null Infinity large float object non-nuermic string
undefined: number 0
null: number 0
true: number 0
1e100: number 0
-1: number 2147483647
Infinity: number 0
NaN: number 0
Math.PI: number 1
Math.pow(2, 32) - 1: number 2147483647
Math.pow(2, 32): number 0
"abc": number 0
" 7 ": number 3
'': number 0
{}: number 0
JSON: number 0
Error(3): number 0
Math.MAX_INT: number 0
*/
var v  = [
	'undefined',
	'null',
	'true',
	'1e100',
	'-1',
	'Infinity',
	'NaN',
	'Math.PI',
	'Math.pow(2, 32) - 1',
	'Math.pow(2, 32)',
	'"abc"',
	'" 7 "',
	'\'\'',
	'{}',
	'JSON',
	'Error(3)',
	'Math.MAX_INT',
	~0,
]

v.forEach(function (str) {
	var value = eval(str)
	var result = value >>> 1
	console.log(str + ':', typeof result, result)
})