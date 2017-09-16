// switch.js

// conclusion: avoid objects and NaN in switch statements

/*
NaN interpreted as true
Array 0 interpreted as abc
Array 1 interpreted as abc
Empty object interpreted as abc
Object(false) interpreted as abc
Object 0 interpreted as abc
Object abc interpreted as abc
Anonymous Function interpreted as Particular Function
Named Function interpreted as Particular Function
Error interpreted as Particular Function
RegExp interpreted as Date
*/
var values = {
	'undefined': undefined,
	'null': null,
	'false': false,
	'true': true,
	'0': 0,
	'1': 1,
	'2': 2,
	'NaN': NaN,
	'Infinity': Infinity,
	'String undefined': 'undefined',
	'String null': 'null',
	'String false': 'false',
	'String 0': '0',
	'String NaN': 'NaN',
	'String Infinity': 'Infinity',
	'Empty String': '',
	'abc': 'abc',
	'Array 0': [ 0 ],
	'Array 1': [ 1 ],
	'Empty object': {},
	'Object(false)': Object(false),
	'Object 0': Object(0),
	'Object abc': Object('abc'),
	'Particular Function': JSON.parse,
	'Anonymous Function': function () {},
	'Named Function': function f() {},
	'Error': Error(),
	'Date': Date(5),
	'RegExp': /a/,
}

for (var valueName in values) {
	var actual
	switch(values[valueName]) {
		case undefined: actual = 'undefined'; break
		case null: actual = 'null'; break
		case false: actual = 'false'; break
		case true: actual = 'true'; break
		case 0: actual = '0'; break
		case 1: actual = '1'; break
		case 2: actual = '2'; break
		case NaN: actual = 'NaN'; break
		case Infinity: actual = 'Infinity'; break
		case 'undefined': actual = 'String undefined'; break
		case 'null': actual = 'String null'; break
		case 'false': actual = 'String false'; break
		case '0': actual = 'String 0'; break
		case 'NaN': actual = 'String NaN'; break
		case 'Infinity': actual = 'String Infinity'; break
		case 'abc': actual = 'abc'; break
		case '': actual = 'Empty String'; break
		case [0]: actual = 'Array(0)'; break
		case [1]: actual = 'Array(1)'; break
		case {}: actual = 'Empty object'; break
		case Object(false): actual = 'Object(false)'; break
		case Object(0): actual = 'Object(0)'; break
		case Object('abc'): actual = 'Object("abc")'; break
		case JSON.parse: actual = 'Particular Function'; break
		case function () {}: 'Anonymous Function'; break
		case function f() {}: 'Named Function'; break
		case Error(): actual = 'Error'; break
		case Date(5): actual = 'Date'; break
		case /a/: actual = 'RegExp'; break
		default: 'default'; break
	}
	if (actual != valueName) console.log(valueName + ' interpreted as ' + actual)
}