// javascript1.js

var uglify = require('uglify-js')
var inspect = require('haraldutil').inspect

module.exports = {
	getTypes: getTypes,
	precedence: precedence,
}

var deepObj = {
	maxString: 0, // unlimited string lengths
	maxProperties: 0, // unlimited array-style properties
	maxLevels: null, // unlimited property levels
	noArrayLength: true, // no leading array length
}

function getTypes() {
	var result = {}
	var typesObject = getObj()
	for (var typename in typesObject) {
		var expressions = typesObject[typename]
		var table = {}
		result[typename] = table
		table.type = typename
		table.expressions = []
		for (var expression in expressions) {
			if (expression == 'comment') {
				table.comment = expressions[expression]
			} else {
				var out = {}
				out.jsHtml = js2html(expression)
				out.value = inspect(eval(expression), deepObj)
				out.comment = expressions[expression]
				table.expressions.push(out)
			}
		}
	}
	return result
}

function js2html(code) {
	var func = arguments.callee.toString().substring(9, arguments.callee.toString().indexOf('(')) || 'anonymous'
	var ast = uglify.parser.parse(code)
	var beauty = uglify.uglify.gen_code(ast, {
		beautify: true,
		ascii_only: true,
	})
	var html = beauty.replace(/;/g, '').replace(/"/g, '\'').replace(/  /g, '&nbsp;').replace(/\n/g, '<br/>')
	return html
}
// each property is an object with a key and a value
// each key is a javascript expression
// each value is a string comment
function getObj() {
	return {
	'undefined type': {
		"typeof undef !== 'undefined'": 'Check if global variable undef has been defined without throwing exception',
		"(function () { var f; return typeof f })()": 'The type of an in-scope unassigned variable is undefined',
	}, 'null type': {
		"(function (x) { return x == null})()": 'Check if an in-scope variable is null or undefined',
		"(function (x) { return x === null})()": 'Check if an in-scope variable is null',
		'typeof null': 'A null variable has an object type, but no constructor property. Object property access on null or undefined values throws exception',
	}, 'boolean type': {
		'comment': 'true values: numbers other than 0 and NaN, non-empty strings, any object.',
		"!!' 5 '": 'Convert to boolean using logical not',
		"Boolean(~'5'.indexOf(6))": 'Convert indexOf result to evaluate to the proper boolean',
		"Boolean(undefined)": 'undefined converts to false',
		"Boolean(null)": 'null converts to false',
		"Boolean(0)": 'The number 0 converts to false',
		"Boolean(NaN)": 'Not a number converts to false',
		"Boolean(1)" : 'Other numbers converts to true',
		"Boolean('')": 'An empty string converts to false',
		"Boolean('0')": 'Other strings converts to true',
		"Boolean(' ')": '',
		"Boolean(({}))": 'Any Object converts to true',
		"Boolean(Object(false))": '',
		"(function () { var f = true; return typeof f === 'boolean' })()": 'Check if a variable has a primitive boolean value',
		"(function () { var f = true; return f != null && typeof f.valueOf() === 'boolean' })()": 'Check if any value is a boolean',
	}, 'number type': {
		'comment': 'There is no integer type.',
		"+' 5 '": 'Convert to number using plus',
		"~~-3.14": 'Convert to integer using two tilde. Rounds towards 0.',
		"Number(undefined)": 'undefined converts to NaN',
		"Number(null)": 'null converts to 0',
		"Number(false)": 'false converts to 0',
		"Number(true)": 'true converts to 1',
		"Number(' ')": 'An empty or white space string converts to 0',
		"Number(' 45 ')": 'numeric strings convert allowing for leading and trailing white space',
		"Number('abc')": 'Non-numeric strings convert to NaN',
		"Number({})": 'Non-Numeric objects convert to NaN',
		"Number(Object(7))": 'Primitive objects converts to corresponding numbers',
		"(function () { var f = 1; return typeof f === 'number' })()": 'Check if a variable has a primitive number value',
		"(function () { var f = 1; return f != null && typeof f.valueOf() === 'number' })()": 'Check if any value is Number',
	}, 'string type': {
		"String(undefined)": 'Convert to string',
		"String(null)": '',
		"String(false)": '',
		"String(0)": '',
		"String(NaN)": '',
		"String(({}))": 'Regular objects become an implementation dependent string',
		"String(Object(true))": 'Primitive-based objects converts to primitive string',
		"(function () { var f = ''; return typeof f === 'string' })()": 'Check if a variable has a primitive string value',
		"(function () { var f = ''; return f != null && typeof f.valueOf() === 'string' })()": 'Check if any value is string value',
	}, 'object type': {
		"({}).toString()": 'How objects are displayed is implementation specific. {} is an empty object. Parenthesis required to distinguish object initializer from block.',
		"typeof Object(false) === 'boolean'": 'Primitives can become wrapped as objects. This is not useful, but some JavaScript functions do this',
		"typeof Object(false).valueOf() === 'boolean'": 'Unwrap a primitive object',
		"(function (f) {return f && f.constructor && f.constructor.name || 'none'})([])": 'Get name of an object\'s constructor',
		"new SyntaxError instanceof Error": 'Determine if an object extends another object.',
		"({}).constructor === Object": 'Determine if a value is an Object object (eg. not an Array)',
		"typeof {} === 'object'": 'Check if a value is of object type.',
	}, 'Testing': {
		'comment': 'Except for objects and NaN, strict equality means same type and value. Values of different types are converted to Number before testing',
		'undefined == null': 'null and undefined tests as being the same value only to each other',
		"false == 0" : 'Boolean and String are first converted to Number, so for numbers, false equals only 0',
		"true == ' 1 '" : 'for numbers, true equals only 1, here as a numeric string',
		"false == '  '" : 'for strings, false equals only an empty or whitespace string (converts to 0)',
		"true == Object(' 1 ')" : 'Boolean are converted to Number, Objects converted to primitive, then Number',
		'NaN == NaN' : 'NaN never equals anything',
		'NaN === NaN' : 'NaN is not identical to anything',
		"'' == ''": 'Strings are equal if they have the same length and characters',
		"25 == ' 25 '" : 'Numbers equal strings that can have leading and trailing whitespace',
		"({}) == ({})" : 'Objects are equal only if they refer to the same object',
		'undefined === undefined': 'Except for objects and NaN, strict equality means same type and value',
	}, 'Global Object': {
		'comment': 'encodeUri decodeUri',
		"NaN": 'Not a number property',
		"Infinity": 'Infitity property',
		"undefined": 'Undefined property',
		"eval('2 + 2')": 'Eval function',
		"parseInt('2.5 trailing garbage')": 'string to integer',
		"parseFloat('2.5 trailing garabage')": 'string to float',
		"isNaN(NaN)": '',
		"isFinite(NaN)": '',
		"encodeURIComponent('%&')": '',
		"decodeURIComponent('%23')": '',
	}, 'Object Objects': {
		'comment': 'getPrototypeOf create defineProperty defineProperties seal freeze preventExtensions isSealed isFrozen isExtensible toLocaleString isPrototypeOf propertyIsEnumerable',
		"Object.keys({ a:1, b:2})": 'Get an array of object properties, similar to for(var property in object)',
		'Object.getOwnPropertyNames([5])':'Get object properties including non-enumerable properties, here a length property',
		"({ a:1, b:2}).hasOwnProperty('a')": 'Check if an  object has a property defined ignoring the prototype chain',
		'Object.getOwnPropertyDescriptor({1:2}, 1)':'Get property descriptor',
		'(function () { var obj = {}; obj.__defineGetter__("x", function () { return 7 }); return obj.x})()': 'Getters and setters can execute code on property access',
		"(new function X() {}).constructor.name": 'Get the name of an object\'s constructor',
		"JSON.stringify({ a:1, b:2})": 'Get object state',
	}, "Function Objects": {
		"(function () {})()": 'The value of a function not returning a value is undefined (leading parenthesis required to indicate expression, not statement)',
		"(function (arg) { return arg })()": 'A function argument not provided has the value undefined',
		"(function (arg) { return JSON.stringify(arguments) })(1)": 'Inside a function there is a variable arguments containing a value map. arguments is an object, not an Array',
		"(function (arg) { return Array.prototype.slice.call(arguments) })(1)": 'Convert arguments to Array',
		"(function theName() { return arguments.callee.name || 'anonymous'})()": 'Get the name of the executing function',
		"(function theName() {}).name": 'Get the function name of a function value',
		"(function f(x) {;}).toString()": 'Get a function\'s declaration',
		"(function (args) { return this }).apply(5, [])": 'invoke a function with a set this value and an array of arguments',
		"(function (arg) { return arg }).call(5, 1)": 'invoke a function with a set this value and a list of arguments',
		"(function (arg) { return this[arg] }).bind({field: 3}, 'field')()": 'bind creates a function alias where this and arguments can be intercepted, here this is set to an object and arg becomes the string "field"',
		"(function (arg1, arg2) {}).length": 'length is typical number of arguments',
		"typeof function () {} === 'function'": 'Check if a value is a function',
	}, 'Array Objects': {
		'comment': 'reduceRight',
		"typeof []": 'Note: Arrays have object type',
		"[1, 2].toString()": 'Get Array state',
		"[1].concat([2], [3]).toString()": 'Array concatenation, one array level of concat arguemnts is reolved',
		"(function (a) {a.push.apply(a, [3, 4]); return a})([1, 2]).toString()": 'Append to Array',
		"[1, 2, 3].join('z')": 'Array as a string',
		"[1, 2, 3].pop()": 'Remove last element from array',
		"[1].push(2)": 'append element to array, returns the appended value',
		"[1, 2].reverse()": 'Reverse array',
		"[1, 2].shift()": 'Remove first element from array',
		"[5, 6, 7, 8].slice(2, 3)": 'Extract sub-array',
		"[1].slice()": 'Clone array',
		"[1, 3, 2].sort()": 'Sort array',
		"[7, 8, 9].splice(1, 2, 4, 5)": 'At index 1, delete 2 items and replace with values 4 and 5, return deleted items',
		"[1].unshift(3)": 'Insert entry at beginning of array, return new length',
		"[2, 2, 3].indexOf(2, 1)": 'Search for entry starting at position, -1 means not found',
		"[3, 3, 3].lastIndexOf(3)": 'Search for last occurrence of value',
		"[1, 2].every(function(value, index, object) { return true})": 'Iterate through array until false is returned. true if false was never returned',
		"[1, 2].some(function(value, index, object) { return true})": 'Iterate through array until true is returned. true if true was returned',
		"[1, 2].forEach(function(value, index, object) {})": 'Iterate through all array items',
		"[1, 2].map(function(value, index, object) { return 5 - value})": 'Iterate through array return array of return values',
		"[1, 2].filter(function(value, index, object) { return value < 2})": 'Iterate through array return array of values when callback returned true',
		"[1, 2].reduce(function(reduce, value, index, object) {return reduce + value})": 'Iterate through array accumulating a value',
		"Array.isArray([ 1 ])": 'Test if a value is an Array',
	}, 'String Objects': {
		'comment': 'charCodeAt concat localeCompare toLocaleLowerCase toLocaleUpperCase fromCharCode',
		'"AbC".charAt(1)': '',
		'"A".concat("b")': '',
		'"abbc".indexOf("b")': '',
		'"abbc".lastIndexOf("b")': '',
		'"abbc".match(/a/)': '',
		'"abc".replace("b", "c")': '',
		'"abbc".search(/a/)': '',
		'"abbc".slice(1, 2)': '',
		'"abbc".split("b")': '',
		'"abbc".substring(1,2)': '',
		'"AbC".toLowerCase()': '',
		'"abbc".toUpperCase()': '',
		'"abbc".trim()': '',
		'"abbc".length': '',
	}, 'Boolean Objects': {
		'comment': 'Easy.'
	}, 'Number Objects': {
		'comment': 'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY toPrecision',
		"3 / 2": 'There is no integer division',
		"Math.floor(3 / 2)": 'integer division result',
		'3.14.toFixed(1)': 'round fraction digits',
		'3.14.toExponential(1)': 'round fraction digits',
	}, 'The Math Object': {
		'comment': 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 acos asin atan atan2 cos sin tan',
		"Math.abs(-1)": 'Absolute value',
		'Math.ceil(-3.14)': 'Round towards positive infinity',
		'Math.exp(1)': 'e powers',
		'Math.floor(-3.14)': 'Round towards negative infinity',
		'Math.max(1, 2, 3)': 'Max value',
		'Math.min(1, 2, 3)': 'Min value',
		'Math.pow(2, 3)': 'Power',
		'Math.random()': '>= 0, <1, typically 30 significant binary digits (9 decimal digits)',
		'Math.round(-1.5)': 'round',
		'Math.sqrt(9)': 'Square root',
	}, "Date Object": {
		'comment': 'Date constructor takes year > 99, month 0..11, date 1.., hours, minutes, seconds, ms. Day is Sunday.. 0-6. ' +
			'MakeTime MakeDay MakeDate TimeClip parse toDateString toTimeString toLocaleString toLocaleDateString toLocaleTimeString ' +
			'get/set-/UTC-FullYear/Month/Date/Day/Hours/Minutes/Seconds/Milliseconds ' +
			'toUTCString toJSON',
		"Date()": 'String representation of now',
		"Date.now()": 'Time value representation of now (unit ms, 1000 * Unix timestamp)',
		"new Date()": 'Date object of now, can take time value argument',
		"new Date().getTime()": 'Convert Date to time value',
		"new Date().getTimezoneOffset()": 'Minutes to add to localtime to get utc',
		"new Date(Date.UTC(1970, 0))": 'Create date using UTC time zone',
		"new Date().toISOString()": 'The only string representation with a known format',
	}, "RegExp Objects": {
		'comment': 'Regular expressions are used with properties test or exec or string functions search, replace, match and split. ' +
			'alternative: | assertions: ^$\\b\\B(?=)(?!) ' +
			'atom: .()(?:) non-atom characters: ^$\\.*+?()[]{}|, atom quantifiers: *+?{n}{n,}{n,n} ' +
			'character classes: [] [^] ' +
			'escapes: \\tnvfr \\000 \\x00 \\u0000 \\character \\c-controlLetter \\d\\D 0-9, \\s\\S white space line terminator, \\w\\W a-zA-Z0-9_, ' +
			'modifiers: g global, m multiline, i ignore case.',
		'/a/g.exec("baac")': 'Look for a. The result is an array with the matched element and two properties',
		' /\\b[sS]ales(\\W|$)/.test("Sales Director")': 'look for sales or Sales as a separate word',
		'"@joe and @jim was here a@b.com".replace(/(( )@|^@)(\\w{1,15})/ig, "$2<@$3>")': 'Finding twitter names but not email addresses',
	}, "Error Objects": {
		'comment': 'EvalError RangeError ReferenceError SyntaxError TypeError ParseError URIError',
		'SyntaxError("que").toString()': 'Specified printout',
		'SyntaxError("que").message': 'Error can have implementation properties such as stack errno code path',
		'new SyntaxError instanceof Error': 'Check for Error',
	}, "The JSON Object": {
		'comment': 'parse(text, reviver) stringify(value, replacer, space)',
		'JSON.stringify({a:1})': '',
		'JSON.parse(\'{ "a": 1}\')': '',
	},
}
}

function precedence() {
	var left = 'Left to right'
	var right = 'Right to left'
	var none = ''
	return [
		{
			a: left,
			'(...)': 'Grouping',
			'function identifier(...) {...}': 'Function expression',
			'memberExpression[...]': 'Bracket property access',
			'memberExpression.identifier': 'Dot property access',
			'new memberExpression(...)': 'new',
		}, {
			a: left,
			'new memberExpression': 'new',
			'memberExpression(...)': 'Function call',
		}, {
			a: none,
			'++': 'Postfix increment',
			'--': 'Postfix decrement',
		}, {
			a: right,
			'++': 'Prefix increment',
			'--': 'Prefix decrement',
			'+': 'Unary plus',
			'-': 'Unary negation',
			'!': 'Logical not',
			'~': 'Bitwise not',
			'delete': '',
			'typeof': '',
			'void': '',
		}, {
			a: left,
			'/': 'Division',
			'*': 'Multiplication',
			'%': 'Remainder',
		}, {
			a: left,
			'+ ': 'Addition',
			'+': 'String concatenation',
			'-': 'Subtraction',
		}, {
			a:left,
			'>>': 'Signed right shift',
			'>>': 'Unsigned right shift',
			'<<': 'Left shift',
		}, {
			a: none,
			'<': 'Less-than',
			'<=': 'Less-than-or-equal',
			'>': 'Greater-than',
			'>=': 'Greater-than-or-equal',
			'instanceof': 'Instance of',
			'in': 'In',
		}, {
			a: none,
			'!==': 'Strict does-not-euqals',
			'===': 'Strict equals',
			'!=': 'Does-not-equals',
			'==': 'Equals',
		}, {
			a:none,
			'&': 'Bitwise and',
		}, {
			a:none,
			'^': 'Bitwise xor',
		}, {
			a:none,
			'|': 'Bitwise or',
		}, {
			a:none,
			'&&': 'Logical and',
		}, {
			a:none,
			'||': 'Logical or',
		}, {
			a:none,
			'?:': 'Conditional',
		}, {
			a:none,
			'=': 'Assignment',
			'*=': 'Compound multiplication assignment',
			'/=': 'Compound division assignment',
			'%=': 'Compound remainder assignment',
			'+=': 'Compound addition assignment',
			'-=': 'Compound subtraction assignment',
			'<<=': 'Compound left shift assignment',
			'>>=': 'Compound right shift assignment',
			'>>>=': 'Compound unsigned right shift assignment',
			'&=': 'Compound bitwise and assignment',
			'^=': 'Compound bitwise xor assignment',
			'|=': 'Compound bitwise or assignment',
		}, {
			a:none,
			',': 'Comma',
		}
	]
}