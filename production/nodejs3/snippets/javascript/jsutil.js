// jsutil.js
// Utilities for JavaScript snippets
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
jsutil.pFileHeader(): prints a file header like: === array 2013-03-03T03:02:13.590Z
top-level and sub-topics are numbers, they go to 99.99. Lead-in is therefore 7 spaces
*/

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')

var log = console.log
var topicCounter
var subTopicCounter

;[
p, pEval, pFileHeader, inspect
].forEach(function (f) {exports[f.name] = f})

/*
Print two-level work breakdown structure style headings like 1.1
string: string: text to print
control:
- true: new top-level entry
- false: a non-heading entry
- string: a file header text line: print caller's filename
- default: sub-heading entry
*/
function p(string, control) {
	var logArgs = []
	if (typeof string !== 'string') string = 'Missing text'
	var controlIsString = typeof control === 'string'

	if (controlIsString && topicCounter == null) { // file heading
		logArgs.push('\n\n===')
		logArgs.push(controlIsString && control ? control : getCallerBasename())
		if (string) logArgs.push(string)
		logArgs.push(new Date().toISOString())

		topicCounter = 0
		subTopicCounter = 0
	} else logArgs.push(getLeadin(control !== true), string)

	log(logArgs.join(' '))
}

/*
Print text line with an evaluated expression
string: string: leading text
expression: string: JavaScript for eval
control:
- true: new top-level entry
- false: a non-heading entry
- string: a file header text line: print caller's filename
- default: sub-heading entry
value: if array, use first value as the evaluated result
noInspect: boolean, default false: output raw value without using inspect
*/
function pEval(string, expression, control, value, noInspect) {
	if (Array.isArray(value)) value = value[0]
	else value = eval(expression)
	string = [string, ': ', expression, '\n', getLeadin(null), ' ',
		noInspect ? value : inspectSingle(value)].join('')
	p(string, control)
}

/*
Print file header like \n\n=== array 2013-03-03T03:02:13.590Z
logFn(string): optional function, default console.log

logFn allows for the caller to capture all jsutil output

return value: logging function
*/
function pFileHeader(logFn) {
	if (typeof logFn === 'function') log = logFn
	p('', getCallerBasename())

	return log
}

/*
Get topic counter lead-in
isSubTopic:
- false, not null, default: '\n1.'
- true: '1.1'
- null: all spaces
lead-in length is constant

lead-in: 2 spaces, 99.99 = 7 characters
1.       Text
  1.1   Text
*/
function getLeadin(isSubTopic) {
	var result = []
	var chars = 0

	if (isSubTopic !== null) {
		if (!isSubTopic) {
			result.push('\n', ++topicCounter, '.')
			subTopicCounter = 0
		} else {
			result.push('\x20\x20', topicCounter, '.', ++subTopicCounter)
			chars += subTopicCounter < 10 ? 3 : 4
		}
		chars += topicCounter < 10 ? 2 : 3
	}
	result.push('\x20\x20\x20\x20\x20\x20\x20'.substring(chars))

	return result.join('')
}

/*
Get basename of the file invoking jsutil
- must be called from exported function

return value: string eg. 'array'
*/
function getCallerBasename() {
	var result = 'unknown'
	var fileExtAndLine = haraldutil.getLocation({offset: 2, object: false, folder: false, fileLine: true})
	if (fileExtAndLine) {
		var fileExt = fileExtAndLine.substring(0, fileExtAndLine.indexOf(':'))
		if (fileExt) {
			var basename = path.basename(fileExt, path.extname(fileExt))
			if (basename) result = basename
		}
	}
	return result
}

/*
Invoke haraldutil.inspect
v: value

Single-line, include non-enumerable properties, no abbreviation

return value: printable string
*/
function inspect(v) { // single line, print everything
	return haraldutil.inspect(v, {
		singleLine: true, // no newline before properties
		dateISO: true, // output Date as ISO string
		errorPretty: true, // output Errors with all properties
		maxString: 0, // do not abbreviate strings
		maxProperties: 0, // do not shorten arrays
		maxLevels: null, // do reduce property level
		noArrayLength: true, // do not display array length
		nonEnum: true, // include non-enumerable properties and prototypes
	})
}

function inspectSingle(v) { // single line without prototypes
	return haraldutil.inspect(v, {
		singleLine: true, // no newline before properties
		dateISO: true, // output Date as ISO string
		errorPretty: true, // output Errors with all properties
		maxString: 0, // do not abbreviate strings
		maxProperties: 0, // do not shorten arrays
		noArrayLength: true, // do not display array length
		maxLevels: null, // do reduce property level
	})
}
