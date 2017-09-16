// util.js
// demonstrate util api
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

var util = require('util') // http://nodejs.org/api/util.html

var jsutil = require('../javascript/jsutil')
var path = require('path') // http://nodejs.org/api/path.html

var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
util.format(format, [...])
util.debug(string)
util.error([...])
util.puts([...])
util.print([...])
util.log(string)
util.inspect(object, [options])
Customizing util.inspect colors
util.isArray(object)
util.isRegExp(object)
util.isDate(object)
util.isError(object)
util.inherits(constructor, superConstructor)

legacy:
util.pump(readableStream, writableStream, [callback])
*/

/*
1.      util.debuglog(set) - not present in 0.10.11
  1.1   set: string: logging filter name
  1.2   return value: function similar to util.format that logs preceeded by "set pid:"
  1.3   sets not present as single word in NODE_DEBUG environment variable are suppressed
*/
p('util.debuglog(set) - not present in 0.10.11', true)
p('set: string: logging filter name')
p('return value: function similar to util.format that logs preceeded by "set pid:"')
p('sets not present as single word in NODE_DEBUG environment variable are suppressed')

//testDebuglog()
function testDebuglog() {
	var debug = util.debuglog()
	debug('x')
}

// TODO: how do you use %j
console.log(util.format('util.format:\n' +
	' s for string: %s\n' +
	' d for number: %d\n' +
	' j for json %j\n' +
	' double-percent: %%s%s\n',
	'Hey', 3.14, { seven: 7 }, '.'))

// TODO: util.inspect(object, showHidden, depth, colors)
console.log('inspect({}):', util.inspect({}))

var o = { one: 1, abc: 'abc', null: null, undefined: undefined, array: [ 1 ]}
console.log('inspect object:', util.inspect(o))

var recursive = { }
recursive.recursive = recursive
console.log('inspect recursive object:', util.inspect(recursive))

var e = Error('a')
console.log('inspect Error:', util.inspect(e))
console.log('inspect Error\'s non-enumerable properties:', util.inspect(e, true))

var oo = { first: { second: {third: 3 }}}
console.log('inspect only 2 of 3 levels', util.inspect(oo, undefined, 1))

util.debug('util.debug() prints to stderr')
util.log('util.log() prints to stdout')
console.log('isError isArray isRegExp isDate')
