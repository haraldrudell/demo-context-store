// regexpjson.js

// whitespace matcher
var whitespace = '^\\s'
var whitespaceRegexp = new RegExp(whitespace + '+')
console.log('Result for failed match is null')
console.log('Result for successful match is array with match at index 0 and properties index and input')
console.log('whitespace-1. Does not match the empty string:', ''.match(whitespaceRegexp))
console.log('whitespace-2. Does not match if first character non-whitespace:', 'z '.match(whitespaceRegexp))
console.log('whitespace-3. matches a single whitespace character:', ' '.match(whitespaceRegexp))
console.log('whitespace-4. matches all leading whitespace characters:', ' \t \n \r z'.match(whitespaceRegexp))

// token matcher
// to skip whitespace, that matching needs to be separate before the token matcher
var tokenRegexp = new RegExp('(' + whitespace + '*)(z)')
console.log('token-1. Does not match empty string:', ''.match(tokenRegexp))
console.log('token-1. Matches whitespace-only:', ' '.match(tokenRegexp))

/*
infunc1: [ 'abc', 'b', 'c', 1, '0abc1abc2' ]
infunc1: [ 'abc', 'b', 'c', 5, '0abc1abc2' ]
result: 0z1z2
*/
console.log('result:', '0abc1abc2'.replace(/a(b)(c)/g, function replaceValue() {
	/*
	replaceValue is invoked for each match due to the g flag of the regexp
	first argument is the portion of searched string that matched
	for each capture group in the regexp, the captured string is provided as an argument or undefined if no match
	the second to last argument is the index in the searched string where the match occurred
	the last argument is the search string
	*/
	// first argument: 
	console.log('infunc1:', Array.prototype.slice.call(arguments, 0))
	return 'z'
}))

var escapeMap = {
	'"': '"',
	'/': '/',
	'\\': '\\',
	'b': '\b',
	'f': '\f',
	'n': '\n',
	'r': '\r',
	't': '\t'
}
var escapeReplace = /\\(?:(["\/\\bfnrt])|u([0-9A-Fa-f]{4}))/g
console.log('result:', 'a\\u0062c\\"d'.replace(escapeReplace, function(matched, escapeChar, escapeHex) {
	var result
	// first argument: 
	console.log('infunc2:', Array.prototype.slice.call(arguments, 0))
	result = escapeChar ? escapeMap[escapeChar] : String.fromCharCode(parseInt(escapeHex, 16))
	return result
}))

var tokenReplace = /(\s*)(false)/
console.log('   zfalse'.match(tokenReplace))

console.log('Whitespace and regexp')
console.log('A regexp skips any leading but not trailing whitespace: "  false  "', '  false  '.match(/false/))
console.log('A regexp skips any leading whitespace: "  \\t  \\r  \\n  false"', '  \t  \r  \n  false'.match(/false/))
console.log('A regexp skips any leading whitespace: "  \\t  \\r  \\n  false"', '  \t  \r  \n  false'.match(/false/))

console.log('Matching final whitespace "  \\t  \\r  \\n  "', '  \t  \r  \n  '.match(/\s*/))
console.log('Matching final whitespace "  \\t  \\r  \\n  "', '  \t  \r  \n  '.match(/\s/))

console.log('Matching whitespace "\\t\\t"', '\t\t'.match(/\s*/))
console.log('Matching whitespace "  "', '  '.match(/\s*/))

console.log('Matching whitespace " \\t \\r "', '  \t \r '.match(/\s*/))
