// string.js

// slice(start, end): allows for negative values
// - start or end negative: goes from end of string
// - end missing: means until end of string
// - both missing: entire string

// substring(start, end)
// - start or end NaN or negative: replaced with 0
// - end missing: means until end of string
// - both missing: entire string

// substr(start, length): second parameter is length
// - start negative: goes from end of string
// - length missing: means until end of string
// - both missing: entire string

var n = 0
//logResult('Remove first n characters of string', "'12345'.substr()")

// 1. Skip first 3 characters of string: '12345'.substring(3) Result:45
logResult('Remove first n characters of string', "'12345'.substring(2)")

// 2. Get last n characters of string, counting from the end: '12345'.slice(-2) Result:45
logResult('Get last n characters of string', "'12345'.slice(-2)")

// 2b. Get last n characters of string, counting from the beginning: '12345'.slice(-2) Result:45
logResult('2b. Get last n characters of string', "'12345'.slice(2)")

// 3. Get first n characters of string: '12345'.substring(0, 2) Result:12
logResult('Get first n characters of string', "'12345'.substring(0, 2)")

// 4. Remove last n characters of string: '12345'.slice(0, -2) Result:123
logResult('Remove last n characters of string', "'12345'.slice(0, -2)")

// 5. Get single character from string: '12345'.charAt(3) Result:4
logResult('Get single character from string', "'12345'.charAt(3)")

function logResult(comment, expr) {
	n++
	val = eval(expr)
	var str = n + '. ' + comment + ': ' + expr + ' Result:' + val
	console.log(str)
}

var a
var b = 'a' + a
// 10 'aundefined'
console.log(b.length, b)
a = null
b = 'a' + a
// 5 'anull'
console.log(b.length, b)

//
var s = 'ab'
var result = 'for (var in string) iterates over each index:'
for (var index in s) result += ' ' + index
// for (var in string) iterates over each index: 0 1
console.log(result)

var s = 'abcb'
/*
1. replace only replaces the first occurrence acb
2. replace with function only replaces the first occurrence acb
3. A regex with modifier g replaces all occurrences ac
*/
console.log('1. replace only replaces the first occurrence', s.replace('b', ''))
console.log('2. replace with function only replaces the first occurrence', s.replace('b', function () { return ''}))
console.log('3. A regex with modifier g replaces all occurrences', s.replace(/b/g, ''))

// replace with same character
console.log('1Q'.replace(/Q/g, 'QQ'))
console.log('2QzQ'.replace(/Q/g, 'QQ'))
console.log('3QQQ'.replace(/Q/g, 'QQ'))

console.log('StringEscape:', "\\\"")