// regexp.js
// Aspects of JavaScript regular expressions
// © Harald Rudell 2012 <harald@therudells.com> All rights reserved.

var p = require('./jsutil').p
var pEval = require('./jsutil').pEval

p('JavaScript regular expressions')

p('Source files', true)
p('regexp (this file): regular expression syntax and special characters')
p('regexpuse: how to execute regular expressions with string objects')
p('regexpmultiline: the multiline flag')
p('regexpglobal: the global flag')
p('', false)
p('regexphtml: regular expression research for tagfinder')
p('regexpjson: regular expression research for greatjson')

p('Regular expression syntax', true)
p('7.8.5 Regular Expression Literals')
p('/ RegularExpressionBody / RegularExpressionFlags')
p('RegularExpressionBody may not be empty, but can be (?:)')
p('The RegularExpressionBody is a Pattern')

p('15.10.1 Patterns', true)
p('characters that are not pattern characters: ^$\\.*+?()[]{}|')
p('15.10.2.3 Disjunctions: The pattern is made up of disjunctions, ie. a self-contain piece of a pattern')
p('<empty>', false)
p('Alternative: <> | <>', false)
p('Assertion: ^ $ \b \B (?= <disjunction> ) (?! <disjunction> )', false)
p('Atom with a possibe Atom Quantifier', false)

p('15.10.2.6 Assertions')
p('^ begining of text, or in multiline mode: character after a newline', false)
p('$ end of text, or in multiline, character preceding a newline', false)
p('\\b word boundary: word-to-non-word or non-word-to-word character sequence', false)
p('\\B is the opposite of \\b', false)
p('(?=) ?', false)
p('(?!) ?', false)
p('Word characters are: a-zA-Z0-9_', false)
p('Newline is \\n \\r unicode line separator or unicode paragraph separator', false)

p('15.10.2.8 Atom', true)
p('character (not ^$\.*+?()[]{}|)')
p('.')
p('\\ escape == \\d\\D 0-9 \\s\\S white space line terminator \\w\\W a-zA-Z0-9_')
p('character classes: [class][^class] class: charcaters or char-char 15.10.2.13')
p('(<disjunction>)')
p('(?:<disjunction>)')
p('Ending Atom quantifier: * + ? {n} {n,} {n,n} 15.10.2.7')

/*

|: either the first Alternative or the second Alternative
- typically needs parenthesis or alternatives wille expand to end of string

Alternative: one or more Assertion Atom or Atom followed by Quantifier

Atom: the unit of macthing, one or more of
character other than ^$\.*+?()[]{}|
.: any character
\f \n \r \t \v: control character
\cletter: control letter

Quantifier:
?: 0 or 1
*: 0 or more
+: 1 or more
{ number }: number times
{number ,}: number or greater times
{ number, number2 }: between number and number2 times

^: beginning of text or if multiline, beginning of a line
$: end of text or if multiline, end of a line
\b matches beginning of a word 15.10.2.6. note word characters
\B matches other than beginning of a word

word boundary:
- beginning of text
- first word character: a-z A-Z 0-9 or _

(?:  )
(?=  )
(?!  ) zero-width negative look-ahead. success if no match
15.10.4.1 flags
g .global
i .ignoreCase
m .multiline

object properties
.lastIndex
.source
*/

/* examine:
(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])
(: starts a capture
\b: assertion: match at beginning of a word
(: another atom to limit end of the last alternative
https?|ftp|file: match either of Alternative
https?: http or https
:\/\/: match these 3 Atoms
[]*: 0 or more of these character ClassRanges
-
A-Z
0-9
+&@#\/%?=~_|!:,.;: one of these characters
[] exactly one of (ie. can not end on: ?!:,.; - deletes punctuation)
- hyphen
A-Z letters, both cases
0-9 digits
+&@#\/%=~_| any of these characters

[]: one of
-: hyphen
A-Z0-9: letters or digits
+&@#\/%=~_|: any of these characters

*/

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')


console.log('\n\n=== regexp')
var 	regExps = [
	{


		search:  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
		replace: '<a class=tweetlink rel=external href="$1">$1</a>'
	},
]

console.log('\n=== Demonstrating RegExp assertions:')
var assertions = {
	'\\b': 'beginning of word',
	'\\B': 'other than beginning of word',
	'^': 'beginning of text or line',
	'$': 'end of text or line',
}
for (var assertion in assertions) {
	console.log('%s: %s', assertion, assertions[assertion])
}
var assert = getAssertionTester('_a _ a_b a_')
for (var assertion in assertions) {
	assert(assertion)
}

function getAssertionTester(string) {
	var invocationCounter = 0
	return assert

	function assert(assertion, newString) {
		if (invocationCounter == 0 || newString) {
			console.log('Text \'%s\', replacing _ with @', string)
			console.log('#. Regular expression: result')
		}
		if (newString) string = newString

		// do the matching
		// $ has to be the last character
		var pattern = assertion != '$' ? assertion + '_' :
			'_' + assertion
		var regExp = RegExp(pattern, 'g')
		var result = string.replace(regExp, '@')
		//console.log('regExp:', regExp)

		// print results
		++invocationCounter
		console.log('%d. %s: \'%s\'',
			invocationCounter,
			regExp,
			result)
	}
}

console.log('\n=== Demonstrating basic patterns:')
var patternsAndStrings = {
	'a': [ 'a', 'babaab' ],
	'a_': [ 'a_', 'a_aa_a_a__' ],
}
var replaceTester = getReplaceTester()
for (pattern in patternsAndStrings) {
	replaceTester.setPattern(pattern)
	var strings = patternsAndStrings[pattern]
	strings.forEach(function(string) {
		replaceTester(string)
	})
}

function getReplaceTester(pattern) {
	var invocationCounter = 0
	var lastPattern
	replace.setPattern = setPattern
	return replace

	function setPattern(pat) {
		pattern = pat
	}

	function replace(string) {

		var regExp = RegExp(pattern, 'g')

		if (invocationCounter == 0 || pattern != lastPattern) {
			lastPattern = pattern
			console.log('Replacing matches with X using regExp:', regExp)
			console.log('#. Input string: Result')
		}

		// do the matching
		var result = string.replace(regExp, 'X')
		//console.log('regExp:', regExp)

		// print results
		++invocationCounter
		console.log('%d. \'%s\': \'%s\'',
			invocationCounter,
			string,
			result)
	}
}

console.log('\n=== Demonstrating RegExp.exec:')
console.log('exec finds one match at a time, and is repeatedly called until it returns null:')
testExec()

function testExec() {
	var regExp = /a/g
	var myString = 'aa'
	// expression: /a/g.exec('aa')
	// 1. [ 'a', index: 0, input: 'aa' ]
	// 2. [ 'a', index: 1, input: 'aa' ]
	// 3. null
	console.log('expression:', regExp + '.exec(\'' + myString + '\')')
	var a = 0
	for (;;) {
		// result is array of length 1
		// the element is a string capturing group from the regexp
		// added properties are
		// index: number the location of the match in the input string
		// input: the string provided to exec
		var result = regExp.exec(myString)
		a++
		/*
		if (result) {
			var s = result[0]
			console.log(s.length, '(' + s + ')')
			console.log(typeof result.index)
			console.log(typeof result.input)
		}
		*/
		console.log('%d.', a, result)
		if (!result) break
	}
}

console.log('\n=== Demonstrating character ranges:')
var stringsAndRanges = {
	'abbc': [ '[b]', '[bc]' ],
	'a-bc': [ '[-a-b]*' , '[-a-b]*[a]' ],
}
var rangeTester = getRangeTester()
for (var string in stringsAndRanges) {
	rangeTester.setString(string)
	var ranges = stringsAndRanges[string]
	ranges.forEach(function(range) {
		rangeTester(range)
	})
}

function getRangeTester() {
	var invocationCounter = 0
	var lastString
	var string

	match.setString = setString
	return match

	function setString(st) {
		string = st
	}
	function match(pattern) {

		// print possible header
		if (invocationCounter == 0 || lastString != string) {
			lastString = string
			console.log('Using string \'%s\', replacing with X', string)
			console.log('#. Regular expression: result')
		}

		// do the matching
		var regExp = RegExp(pattern, 'g')
		var result = string.replace(regExp, 'X')

		// print results
		++invocationCounter
		console.log('%d. %s:',
			invocationCounter,
			regExp,
			result ? result : 'no match')
	}
}

console.log('\n=== Demonstrating match:')
//console.log("$1,$2".match(/(\$(\d))/g))
matchTester("$1,$2", /(\$(\d))/g)
function matchTester(string, regExp) {
	console.log('\'%s\'.match(%s):',
		string,
		regExp,
		string.match(regExp))
}

console.log('\n=== Demonstrating replace:')
//console.log("$1,$2".replace(/(\$(\d))/g, "$$1-$1$2"))
console.log('There are two matches')
console.log('Each match has two captures')
console.log('The first match has capture $1 X1 and $2 1')
console.log('The second match has capture $1 X2 and $2 2')
console.log('Each matched string is replaced by the parsing of the replacement value')
var stringsRegExpsAndReplacements = {
	'X1,X2': {
		'(X(\\d))': [ '', 'X', '$$', '$1', '$2', '$$1-$1$2', ],
	},
	'$1,$2': {
		'(\\$(\\d))': [ '', 'X', '$$', '$1', '$2', '$$1-$1$2', ],
	},
}
var replaceTextTester = getReplaceTextTester()
for (var string in stringsRegExpsAndReplacements) {
	replaceTextTester.setString(string)
	var regExpsAndReplacements = stringsRegExpsAndReplacements[string]
	for (var regExp in regExpsAndReplacements) {
		replaceTextTester.setRegExp(regExp)
		var replacements = regExpsAndReplacements[regExp]
		replacements.forEach(function (replacement) {
			replaceTextTester(replacement)
		})
	}
}

function getReplaceTextTester() {
	var invocationCounter = 0
	var lastString
	var string
	var regExp
	var lastRegExp

	replace.setString = setString
	replace.setRegExp = setRegExp
	return replace

	function setString(st) {
		string = st
	}

	function setRegExp(re) {
		regExp = re
	}

	function replace(replacement) {

		// print possible header
		if (invocationCounter == 0 ||
			lastString != string ||
			lastRegExp != regExp) {
			lastString = string
			lastRegExp = regExp
			console.log('#. string, regular expression, replacement value: result')
		}

		// do the matching
		var theRegExp = RegExp(regExp, 'g')
		var result = string.replace(theRegExp, replacement)

		// print results
		++invocationCounter
		console.log('%d. \'%s\', %s, \'%s\': \'%s\'',
			invocationCounter,
			string,
			theRegExp,
			replacement,
			result)
	}
}

console.log('\n=== Demonstrating matching Twitter username:')
console.log('issue with match: can not match characters that will not be part of the result (maybe need JavaScript 1.5)')
console.log('Therefore, use replace and mark up the found usernames')
var usernames = [
	// test at beginning of string, at beginning of word
	// middle of word
	'joe', 'zz joe', 'jjoe', // joe without @
	'@joe', ' @joe', 'joe @joe', 'j@joe', // twitter user @joe
	'@joej',	// extra characters
	'@joe4567890123456', // 16 characters
	'@joe@jim',	// two merged
	'@joe @jim',	// two subsequent
	'@joe&',	// illegal characters
]
var usernameMatcher = getUsernameMatcher()
usernames.forEach(function (username) {
	usernameMatcher(username)
})

function getUsernameMatcher() {
	var invocationCounter = 0
	return usernameMatcher

	function usernameMatcher(string) {
		if (invocationCounter == 0) {
			console.log('string: result')
		}
// 1. first shot at reghular expression
// does not work for some reason
//		var result = string.match(/\b@([A-Z0-9_]{1-15})/ig)
// 2. try to find @joe: this works:
//		var result = string.match(/@joe/ig)
// 3. try to find @joe only at beginning of word
// only works if joe at the end
// @ is not a word character, so \b@ will never match
//		var result = string.match(/@joe/ig)
// 4. Use some other means than \b
// also require a leading space, otherwise it will match email adresses
// so we have to test for either space-commerical a or beginning of string commercial a
// there needs to be a parenthesis around this alternative, so the second alternative does not become the entire regexp
// since (?:, non-capturing parenthesis does not seem to work, do not use it
// the alternative parenthesis therfore becomes capture 1
// we need to remember if we had a space, that becomes capture group 2
// the twitter username becomes capture group 3
//		var result = string.replace(/(( )@|^@)(joe)/ig, '$2<@$3>')
// 4. now search for any username
// fails: matches nothing
//		var result = string.replace(/(( )@|^@)([a-z0-9_]{1-15})/ig, '$2<@$3>')
// 5. try for any characters
// fails: matches nothing
//		var result = string.replace(/(( )@|^@)(.{1-15})/ig, '$2<@$3>')
// 6. try for unlimited username length
		var result = string.replace(/(( )@|^@)([a-z0-9_]*)/ig, '$2<@$3>')
// 7. it should be comma inside {}
		var result = string.replace(/(( )@|^@)([a-z0-9_]{1,15})/ig, '$2<@$3>')
// try to find any username: this works:
//		var result = string.match(/@[a-z0-9_]*/ig)
// only find if at beginning of word
//		var result = string.match(/\b@[a-z0-9_]*/ig)
//		var result = string.match(/\b@(j)/ig)
//		var result = string.match(/\b@(j).*/ig)
		console.log('%d. \'%s\': \'%s\'',
			invocationCounter++,
			string,
			result)
	}
}

// how to match reload from 'control reload'
// matches
console.log(/.*(reload).*/.test('control reload'))
// matches
console.log(/.*(reload)/.test('control reload'))
//does not match
console.log(/.*\s(reload)\s/.test('control reload'))
console.log(/.*\s(reload)\s/.test('control reload'))
console.log(/\s(reload)\s/.test('control reload'))
console.log(/.*\s(reload)\s.*/.test('control reload'))
// matches
console.log(/.*\s(reload)/.test('control reload'))
// does not match: \s does not match beginning or end of string
console.log(/.*\s(control)/.test('control reload'))
// matches
console.log(/\b(reload)/.test('control reload'))
// does not match
console.log(/\b(reload)\B/.test('control reload'))
// does not match
console.log(/\b(reload)[ $]/.test('control reload'))
// does not match
console.log(/\b(reload)[$]/.test('control reload'))
// matches
console.log(/\b(reload)$/.test('control reload'))
// matches
console.log(/\b(reload)($|\s)/.test('control reload'))
console.log(/\b(control)($|\s)/.test('control reload'))
// 'reload'
console.log('control reload'.match(/\b(reload)($|\s)/)[1])
// 'control'
console.log('control reload'.match(/\b(control)($|\s)/)[1])

// find sales or Sales
// test strings: 'Sales Director', 'Account Executive, Publisher Sales'
//
// 1. I know that \b works for detecting beginning of word
// 2. I have tested that [sS] works for matching one character case insensitive
//
// How do I match end of word?
//			jobTitleRegex = /\b(s|S)ales($| )/
//			jobTitleRegex = /\b[sS]ales($| )/
//			jobTitleRegex = /\b[sS]ales[$ ]/
// these do not match: \B does not work for end of string or space
console.log('x', /\b[sS]ales\B/.test('Sales Director'))
console.log('x', /\b[sS]ales\B/.test('Account Executive, Publisher Sales'))
// these work
console.log('y', /\b[sS]ales(\s|$)/.test('Sales Director'))
console.log('y', /\b[sS]ales(\s|$)/.test('Account Executive, Publisher Sales'))
// \s does not work for end of string
console.log('y', /\b[sS]ales\s/.test('Sales Director'))
console.log('y', /\b[sS]ales\s/.test('Account Executive, Publisher Sales'))
// \W does not work for end of string
console.log('x1', /\b[sS]ales\W/.test('Sales Director'))
console.log('x1', /\b[sS]ales\W/.test('Account Executive, Publisher Sales'))
// $ does not work inside character class
console.log('x2', /\b[sS]ales[\W$]/.test('Sales Director'))
console.log('x2', /\b[sS]ales[\W$]/.test('Account Executive, Publisher Sales'))
// this works in both cases
console.log('x3', /\b[sS]ales(\W|$)/.test('Sales Director'))
console.log('x3', /\b[sS]ales(\W|$)/.test('Account Executive, Publisher Sales'))

// how do I find comments in html?
var html = 'a<!--b-->c'
// we can find opening angle bracket at index 1
// h1. [ '<!--b-->', index: 1, input: 'a<!--b-->c' ]
console.log('h1.', html.match(/<.*>/))
// we can extract the angle bracket text
// h2. [ '<!--b-->' ]
console.log('h2.', html.match(/<.*>/gm))
// we can remove the angle bracket text
// h3. ac
console.log('h3.', html.replace(/<.*>/gm, ''))
// for complete comment
// h4. ac
console.log('h4.', html.replace(/<!--.*-->/gm, ''))

// how do I make matching not greedy?
// want to get ace
var html = 'a<!--b-->c<!--d-->e'
// problem is that c is removed here:
// h5. ae
console.log('h5.', html.replace(/<!--.*-->/gm, ''))
console.log('h5.', html.replace(/<!--[^-]-->/gm, ''))
// you must provide the empty string, or replace converts undefined t string
// h6. aundefinedc
console.log('h6.', 'abc'.replace('b'))

// I want to find multiple non-space words in a string
// for simplicity do space versus a, ignore case and multi-line
// one or more characters
// string.match(regexp) with global flag
// beginning of text, middle of text, end of text
console.log('a '.match(/a+/g))
console.log(' a '.match(/a+/g))
console.log(' a'.match(/a+/g))
console.log('a aa a'.match(/a+/g))

// howevber we are matching non-space
console.log('a '.match(/[^ ]+/g))
console.log(' a '.match(/[^ ]+/g))
console.log(' a'.match(/[^ ]+/g))
console.log('a aa a'.match(/[^ ]+/g))

// extract the arguments for a function object
// here is the function
var f = function blaha(a, b, c) {}
// here is the source of the function
var source = f.toString()
// source: function blaha(a, b, c) {}
console.log('source:', source)
var re = /^function /
// Find function: [ 'function ', index: 0, input: 'function blaha(a, b, c) {}' ]
console.log('Find function:', re.exec(source))
var re = /^function ([^\(]*)\(/
/*
Find function name: [ 'function blaha(',
  'blaha',
  index: 0,
  input: 'function blaha(a, b, c) {}' ]
*/
console.log('Find function name:', re.exec(source))
var re = /^function ([^\(]*)(\([^\)]*\)) {/
// find parameters:
console.log('Find function name and parameters:', re.exec(f.toString()))

// match exactly one space
var re = /a b/
console.log('A space in regexp matches literally',
	re.test('ab'),
	re.test('a  b'),
	re.test('a b'),
	re.test('a\tb')
)

// match function source
// Braces 1: Single line is easy [ '{b}', 'b', index: 1, input: 'a{b}c' ]
console.log('Braces 1: Single line is easy', 'a{b}c'.match(/\{(.*)\}/))
// Braces 2: Multi line needs special care for newline null
console.log('Braces 2: Multi line needs special care for newline', 'a{b\nc}d'.match(/\{(.*)\}/m))
// Braces 3: Multi line needs special care for newline, . is sS [ '{b\nc}', 'b\nc', index: 1, input: 'a{b\nc}d' ]
console.log('Braces 3: Multi line needs special care for newline, . is \s\S', 'a{b\nc}d'.match(/\{([\s\S]*)\}/m))
// Braces 4. it works! 'c'
console.log('Braces 4. it works!', haraldutil.inspectDeep('a\nb{\nc}\nd'.match(/[\s\S]*\{([\s\S]*)\}/m)[1].trim()))

// match newline
console.log('Mathcing newline in multiline text')
console.log('^ matches the beginning of each line and of the text', haraldutil.inspect('a\nb\nc'.replace(/^/gm, 'X')))
console.log('\\n matches newlines', haraldutil.inspect('a\nb\nc'.replace(/\n/gm, 'X')))
console.log('\\n\\n matches two newlines', haraldutil.inspect('a\n\nb\nc'.replace(/\n\n/gm, 'X')))
