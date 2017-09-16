// regexpuse.js
// How to execute JavaScript regular expressions
// © Harald Rudell 2012 <harald@therudells.com> All rights reserved.

var p = require('./jsutil').p
var pEval = require('./jsutil').pEval

p('How to use regular expressions in JavaScript')

/*
How can regular expressions be used?
functions
.exec: returns an array describing the match
- length is 1, element is the complete matching string, irregardles of capture groups
- added properties:
- index: position in inoput string where match started
- input: the string provided to exec
.test: returns boolean
string.replace(searchValue, replaceValue)
- searchValue can be string or regexp, and regexp can have igm flags
- replaceValue can be string or function
-- function(matched substring, ( one match argument for each match), matchLocation, string)
-- string can have $ expansion
string.search: returns index of match
string.split
*/

/*
1.   Ways to use RegExp
1a.  regExp.test(string)
1b.  regExp.exec(string)
1c.  string.search(regExp)
1d.  string.split(regExp)
1e.  string.match(regExp)
1f.  string.replace(regExp, string / function)
*/
p('Ways to use RegExp', true)
p('regExp.test(string)')
p('regExp.exec(string)')
p('string.search(regExp)')
p('string.split(regExp)')
p('string.match(regExp)')
p('string.replace(regExp, string / function)')

// 4. RegExp.test(string) only returns true or false
// true true false true
var regExp = /a/g
var string = 'aa'
console.log('4.', regExp.test(string), regExp.test(string), regExp.test(string), regExp.test(string))

// 5. RegExp.exec(string) returns capture groups, matching index and original string
//[ 'abcde', 'bcd', 'b', 'cd', index: 1, input: '0abcdef' ]
var regExp = /a((.)(..))e/
var string = '0abcdef'
console.log('5.', regExp.exec(string))

// 6. string.search(regexp): returns index of the first match
// note that repeated search is not possible
// 0 0 0
var regExp = /a/g
var string = 'aa'
console.log('6.', string.search(regExp), string.search(regExp), string.search(regExp))

// 7. string.split(regexp): reapplies the regexp even if it does not have g flag
// repeated search does not apply
//[ '1', '2', '3' ] [ '1', '2', '3' ] [ '1', '2', '3' ]
var regExp = /a/g
var string = '1a2a3'
console.log('7a.', string.split(regExp), string.split(regExp), string.split(regExp))
//[ '1', '2', '3' ] [ '1', '2', '3' ] [ '1', '2', '3' ]
var regExp = /a/
var string = '1a2a3'
console.log('7b.', string.split(regExp), string.split(regExp), string.split(regExp))

// 8. string.match(regexp): returns only matched string
// without global flag, only the first match can be found
//[ 'ab', index: 0, input: 'abcacd' ] [ 'ab', index: 0, input: 'abcacd' ] [ 'ab', index: 0, input: 'abcacd' ]
var regExp = /a./
var string = 'abcacd'
console.log('8a.', string.match(regExp), string.match(regExp), string.match(regExp))
// with global flag, only the matched strings are returned
// repeated search does not apply
//[ 'ab', 'ac' ] [ 'ab', 'ac' ] [ 'ab', 'ac' ]
var regExp = /a./g
var string = 'abcacd'
console.log('8b.', string.match(regExp), string.match(regExp), string.match(regExp))
// without global flag, only the first match can be found
//[ 'abcde', 'bcd', 'b', 'cd', index: 1, input: '0abcdef0a123ef' ] [ 'abcde', 'bcd', 'b', 'cd', index: 1, input: '0abcdef0a123ef' ]
var regExp = /a((.)(..))e/
var string = '0abcdef0a123ef'
console.log('8c.', string.match(regExp), string.match(regExp))
// with global flag, only capture groups are returned
// repeated search does not apply
// [ 'abcde', 'a123e' ] [ 'abcde', 'a123e' ]
var regExp = /a((.)(..))e/g
var string = '0abcdef0a123ef'
console.log('8d.', string.match(regExp), string.match(regExp))

// 9. string.replace(regexp, string)
// string.replace(regexp, function)
// if no global and second argument is string: only the first match is replaced
// repeated replace does not apply
var regExp = /a/
var string = 'aa'
var string2 = 'b'
console.log('9a.', string.replace(regExp, string2), string.replace(regExp, string2))
// if global and second argument is string: all matches are replaced
// repeated replace does not apply
var regExp = /a/g
var string = 'aa'
var string2 = 'b'
console.log('9b.', string.replace(regExp, string2), string.replace(regExp, string2))
// if no global and second argument function:
// - arg1: first match, arg2: index, arg3: input string
// replace the first match with function result
// repeated replace does not apply
// { '0': 'a', '1': 0, '2': 'aa' } { '0': 'a', '1': 0, '2': 'aa' } $1a $1a
var regExp = /a/
var string = 'aa'
console.log('9c.', string.replace(regExp, f), string.replace(regExp, f))
// if global and second argument function: invoked for each match
// - arg1: first match, arg2: index, arg3: input string
// replace each match with function result
// repeated replace does not apply
//{ '0': 'a', '1': 0, '2': 'aa' } { '0': 'a', '1': 1, '2': 'aa' } { '0': 'a', '1': 0, '2': 'aa' } { '0': 'a', '1': 1, '2': 'aa' }
//$1$1 $1$1
var regExp = /a/g
var string = 'aa'
console.log('9d.', string.replace(regExp, f), string.replace(regExp, f))
function f() {
	console.log(arguments)
	return '$1'
}

// 10. build regexp using strings
// to create the \b escape, two backslahes must be used
// /a\b/
var regExp = new RegExp('a\\b')
console.log('10a.', regExp)
// or with empty path works
//[ 'a1bc', 'a1c' ]
var regExp = /a.(|b)c/g
var string = 'a1bca1c'
console.log('10b.', string.match(regExp))
