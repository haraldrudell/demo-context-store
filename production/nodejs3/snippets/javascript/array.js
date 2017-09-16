// array.js
// Explore JavaScript arrays
// © 2012 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var jsutil = require('./jsutil')

var p = jsutil.p
var pEval = jsutil.pEval

var a = [{a:1}, {a:2}, {a:3}]
var b = a.filter(function(o, index, object) {
	return o.a !== 2
})
console.log(a, b)

jsutil.pFileHeader()

/*
1.      Array objects
  1.1   An array has object type: typeof []
        'object'
  1.2   Check any value for being array: Array.isArray([])
        true
*/
p('Array objects', true)
pEval('An array has object type', 'typeof []')
pEval('Check any value for being array', 'Array.isArray([])')

/*
2.      Array instances
  2.1   Get array value: String([1, 2])
        '1,2'
  2.2   Convert array to string: [1,2].join('z')
        '1z2'
  2.3   Assigning an array value refers to the same array. To shallow-clone an array: [1].slice()
        1[1]
  2.4   Shallow-cloning parts of an array: [1, 2, 3].slice(1, 2)
        1[2]
  2.5   Convert arguments object to array: (function f(a) {return Array.prototype.slice.call(arguments)})('abc')
        1['abc']
  2.6   Array literal: [1]
        1[1]
  2.7   Array constructor: new Array(1)
        1[]
  2.8   Array indices are numeric strings (false converts to Number 0 but String 'false'): var x = [1]; x[false]
        undefined
  2.9   Concat creates a combined array, resolving one array level: [1].concat(2, [3], [[4]])
        4[1, 2, 3, 1[4]]
  2.10  Concat does add undefined: [1].concat(undefined)
        2[1, undefined]
*/
p('Array instances', true)
pEval('Get array value', 'String([1, 2])')
pEval('Convert array to string', '[1,2].join(\'z\')')
pEval('Assigning an array value refers to the same array. To shallow-clone an array', '[1].slice()')
pEval('Shallow-cloning parts of an array', '[1, 2, 3].slice(1, 2)')
pEval('Convert arguments object to array', '(function f(a) {return Array.prototype.slice.call(arguments)})(\'abc\')')
pEval('Array literal', '[1]')
pEval('Array constructor', 'new Array(1)')
pEval('Array indices are numeric strings (false does not convert to Number 0 but String \'false\')', 'var x = [1]; x[false]')
pEval('Concat creates a combined array, resolving one array level', '[1].concat(2, [3], [[4]])')
pEval('Concat does add undefined', '[1].concat(undefined)')

/*
3.      Array manipulation: pop push reverse shift unshift sort splice
  3.1   unshift
  3.2   shift
  3.3   pop
  3.4   push adds values without resolving arrays and returns resulting array size
  3.5   push pushes undefined
*/
p('Array manipulation: pop push reverse shift unshift sort splice', true)
p('unshift', 'var a = [1, 2]; var b = 3; var c = a.unshift(b); [a, c]')
p('shift', 'var a = [1, 2]; var b = a.shift(); [a, b]')
p('pop', 'var a = [1, 2]; var b = a.pop(); [a, b]')
p('push adds values without resolving arrays and returns resulting array size', 'var a = [1]; var b = a.push(8, [9], [[10]]); [a, b]')
p('push pushes undefined', 'var a = [1]; var b = a.push(undefined); [a, b]')

/*
4.      Array iteration: for-in forEach every some map filter
  4.1   for-in iteration over array has numeric string array index 0..:
  4.2   for-in works for any value
  4.3   Iteration includes undefined and null values
  4.4   forEach iterates over all values and returns undefined
  4.5   Iteration member functions have arguments value, Number index, array object
  4.6   During member iteration, values can be modified or deleted, but not appended
  4.7   During for-in iteration, values can be deleted but not appended
  4.8   TODO every some map filter
*/
p('Array iteration: for-in forEach every some map filter', true)
p('for-in iteration over array has numeric string array index 0..:', 'var x;for (var a in [5]) x=a;x')
p('for-in works for any value', 'for (var a in undefined) ; true')
p('Iteration includes undefined and null values', 'var x = 0; for (var a in [undefined, null, false]) x++; x')
p('forEach iterates over all values and returns undefined', '[5].forEach(function () {return 1})')
p('Iteration member functions have arguments value, Number index, array object', 'var x; [5].forEach(function () {x = Array.prototype.slice.call(arguments)}); x')
p('During member iteration, values can be modified or deleted, but not appended', 'var x = \'\'; var arr = [\'a\', \'b\', \'c\']; arr.forEach(function (value) {arr[1] = \'modified\'; delete arr[2]; arr[3] = \'added\'; x += value}); x')
p('During for-in iteration, values can be deleted but not appended', 'var x = \'\'; var arr = [\'a\', \'b\']; for (var i in arr) {delete arr[1]; arr[2] = \'added\'; x += i}; x')
p('TODO every some map filter')

/*
5.      Array delete
  5.1   Arrays are not sparse
  5.2   deleting elements does not affect length
  5.3   for-in skips deleted values
  5.4   forEach skips deleted values
*/
p('Array delete', true)
p('Arrays are not sparse', 'var arr = []; arr[1] = true; arr.length')
p('deleting elements does not affect length', 'var arr = [1, 2]; delete arr[1]; arr.length')
p('for-in skips deleted values', 'var x = 0; var arr = [1, 2, 3]; delete arr[1]; for (var a in arr) x++; x')
p('forEach skips deleted values', 'var x = 0; var arr = [1, 2, 3]; delete arr[1]; arr.forEach(function () {x++}); x')

/*
6.      Appendix
  6.1   Assignment of an array value references the same array
  6.2   Slice creates an array clone
  6.3   Convert object to array requires length property
  6.4   Array constructor does not resolve arrays
  6.5   Can I merge objects? concat works for array this value
  6.6   Can I merge objects? this Number wraps as Object
  6.7   Can I merge objects? No, this object creates an array of objects, not a merged object
*/
p('Appendix', true)
p('Assignment of an array value references the same array',
	'(function () {var a = [\'unchanged\']; var b = a; b[0] = \'changed\'; return a})()')
p('Slice creates an array clone',
	'(function () {var a = [\'unchanged\']; var b = a.slice(); b[0] = \'changed\'; return a})()')
p('Convert object to array requires length property', 'Array.prototype.slice.call({0: \'a\', length: 1})')
p('Array constructor does not resolve arrays', 'new Array(1, [2, 3], 4)')
p('Can I merge objects? concat works for array this value', 'Array.prototype.concat.call([0], 1, [2, 3], 4)')
p('Can I merge objects? this Number wraps as Object', 'Array.prototype.concat.call(1, [2, 3], 4)')
p('Can I merge objects? No, this object creates an array of objects, not a merged object', 'Array.prototype.concat.call({a: 1}, {b: 2})')
