// objectkey.js
// Examine object key values
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
8.6 An Object is a collection of properties
- a data property associates with a value
- an accessor property associates with get and put functions
names are string values
*/
var jsutil = require('./jsutil')

var p = jsutil.p
var pEval = jsutil.pEval
var log = console.log

jsutil.pFileHeader()

/*
1.      Object property names are strings
  1.1   Provided name values are converted to strings, so strings and corresponding numbers merge
  1.2   For objects, a toString property providing unique identifiers is required
*/
p('Object property names are strings', true)
p('Provided name values are converted to strings, so strings and corresponding numbers merge')
p('For objects, a toString property providing unique identifiers is required')

/*
2.      Examples:
  2.1   key expression: 12 "'0'" merges with expression: 4 "0"
  2.2   key expression: 13 "'1.2'" merges with expression: 7 "1.2"
  2.3   key expression: 14 "'-Infinity'" merges with expression: 8 "-Infinity"
  2.4   key expression: 15 "'NaN'" merges with expression: 10 "NaN"
  2.5   key expression: 17 "({})" merges with expression: 16 "({})"
  2.6   key expression: 18 "({0:""})" merges with expression: 16 "({})"
  2.7   key expression: 19 "({0:''})" merges with expression: 16 "({})"
  2.8   key expression: 20 "({0:5})" merges with expression: 16 "({})"
  2.9   key expression: 21 "Object(false)" merges with expression: 2 "false"
  2.10  key expression: 22 "Object(undefined)" merges with expression: 16 "({})"
  2.11  key expression: 23 "Object(null)" merges with expression: 16 "({})"
  2.12  key expression: 24 "Object(0)" merges with expression: 4 "0"
  2.13  key expression: 25 "Object('0')" merges with expression: 4 "0"
  2.14  key expression: 26 "[1]" merges with expression: 5 "1"
*/
p('Examples:', true)
findAmbiguousPropertyNames(getProperties()).forEach(p)

function findAmbiguousPropertyNames(properties) {
	var result = []
	var object = {}

	for (var index in properties.values) {
		var value = properties.values[index]
		var mergeIndex = object[value]
		if (mergeIndex == null) object[value] = index
		else {
			result.push([
				'key expression:', index, '"' + properties.expressions[index] + '"',
				'merges with expression:', mergeIndex, '"' + properties.expressions[mergeIndex] + '"',
				].join(' '))
		}
	}

	return result
}

function getProperties() { // return value: object with two arrays: expressions, values
	var result = {
		expressions: [ // list of string expressions
			'undefined', 'null', // undefined and null
			'false', 'true', // boolean
			'0', '1', '12', '1.2', '-Infinity', '+Infinity', 'NaN', // number
			'\'\'', '\'0\'', '\'1.2\'', '\'-Infinity\'', '\'NaN\'', // string
			'({})', '({})', '({0:""})', '({0:\'\'})', '({0:5})', // object uniqueness
			'Object(false)', 'Object(undefined)', 'Object(null)', 'Object(0)', 'Object(\'0\')', // object primitives
			'[1]', '[1, 2]', 'Date(1)', '(function f () {})', '/z/', 'Error(0)',

			// very long, almost similar strings
			'for(var a=0,b="a";a<1024;a++)b+="a";b', // 1024xa
			'for(var a=0,b="a";a<1023;a++)b+="a";b+="b";b', // 1023xa+b
		],
		values: []
	}

	result.expressions.forEach(convertExpressionToValue)

	return result

	function convertExpressionToValue(expression, index) {
		try {
			result.values.push(eval(expression))
		} catch (e) {
			log('expression:',
				'index:', index,
				'string:', expression,
				'caused exception:', e.stack || e.message || e)
			throw e
		}
	}
}
