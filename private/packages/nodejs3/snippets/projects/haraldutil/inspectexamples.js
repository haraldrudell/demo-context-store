// inspectexamples.js
// Actual output from inspect
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

var jsutil = require('../../javascript/jsutil')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

primitives = [
	'undefined', 'null',
	'false', 'true',
	0, NaN, Infinity, -Infinity, 0.5, 1e200, 1.5e200, 1e-200,
	'"abc"']
var p = jsutil.p
var pEval = jsutil.pEval
var i = jsutil.i

jsutil.pFileHeader()

p('Primitive values', true)
primitives.forEach(printPrimitive)
function printPrimitive(expression) {
	var value = haraldutil.inspect(eval(expression))
	pEval(expression, '', undefined, [value], true)
}

p('string: abbreviate and escape', true)
var s = 'abcd'
var o = {maxString: 3}
pEval('Option maxString: 3', s, undefined, [haraldutil.inspect(s, o)], true)
var s = '\n\u0001'
var o = {}
pEval('Escaping newline and code 1', '(unprintable)', undefined, [haraldutil.inspect(s, o)], true)

p('Array: abbreviate and dimension', true)
var s = [1, 2]
var o = {}
pEval('With dimension', s, undefined, [haraldutil.inspect(s, o)], true)
var s = [1, 2]
var o = {noArrayLength: true}
pEval('Option noArrayLength: true', s, undefined, [haraldutil.inspect(s, o)], true)
var s = [1, 2, 3, 4]
var o = {maxProperties: 1}
pEval('Option maxProperties: 1', s, undefined, [haraldutil.inspect(s, o)], true)

p('Object: abbreviate and single line', true)
var s = {a: 1, b: 2}
var o = {}
pEval('object', s, undefined, [haraldutil.inspect(s, o)], true)
var s = {a: 1, b: 2}
var o = {singleLine: true}
pEval('Option singleLine: true', s, undefined, [haraldutil.inspect(s, o)], true)
var s = {a: 1}
var o = {maxLevels: 0}
pEval('Option maxLevels: 0', s, undefined, [haraldutil.inspect(s, o)], true)

p('Date: number or iso', true)
var s = new Date(1980, 0)
var o = {}
pEval('Date', s, undefined, [haraldutil.inspect(s, o)], true)
var s = new Date(1980, 0)
var o = {dateISO: true}
pEval('Option dateISO: true', s, undefined, [haraldutil.inspect(s, o)], true)

p('Error: plain', true)
doError({})

p('Error: errorPretty', true)
doError({errorPretty: true})

p('Error: singleLine', true)
doError({singleLine: true})

p('Error: nonEnum', true)
doError({nonEnum: true}, true)

p('Error: nonEnum, singleLine', true)
doError({nonEnum: true, singleLine: true}, true)

p('Object, prototypes only', true)
function Sub() {}
Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}})
function Base() {}
var s = new Sub
var o = {singleLine: true, nonEnum: true}
pEval('Option nonEnum: true, singleLine: true', s, undefined, [haraldutil.inspect(s, o)], true)

function doError(o, skipTwo) {
	if (!skipTwo) {
		var s
		try {
			JSON.parse()
		} catch (e) {
			s = e
		}
		pEval('Error with non-enumerable properties', s, undefined, [haraldutil.inspect(s, o)], true)
		var s = new Error('bad')
		s.p = 1
		pEval('Error with enumerable properties', s, undefined, [haraldutil.inspect(s, o)], true)
	}
	var s
	try {
		JSON.parse()
	} catch (e) {
		s = e
	}
	s.p = 1
	pEval('Error with both properties', s, undefined, [haraldutil.inspect(s, o)], true)
}
