// encodeuricomponent.js
// How encodeURIComponent works with utf-8
// © Harald Rudell 2012 <harald@therudells.com> All rights reserved.
var p = require('./jsutil').p
var pEval = require('./jsutil').pEval

p('How encodeURIComponent works with utf-8')

p('Characters are encoded with a percent sign and two upper case hexadecimal digits', true)
pEval('Question mark is ascii 63, or 3f hex', 'encodeURIComponent(\'?\')')

p('What characters are not encoded?', true)
var chars = ''
for (var c = 0; c < 256; c++) {
	var char = String.fromCharCode(c)
	if (encodeURIComponent(char) === char) chars += char
}
p(['For single byte characters, the following',
	chars.length, 'are not encoded:', ['"', chars, '"'].join(''),
	].join(' '))
p('As ranges: A-Za-z0-9!\'()*-._~')
for (var c = 0; c < 256; c++) {
	var char = String.fromCharCode(c)
	var encoded = encodeURIComponent(char)
	if (encoded !== char && encoded[0] !== '%') console.log(char)
}
console.log(encodeURIComponent(' '))
console.log(encodeURIComponent('\''))
p('Handling of multi-byte characters', true)
var utf8string = '€'
var byteBuffer = new Buffer(utf8string)
pEval('The Euro sign \'€\' is encoded in number of bytes', 'new Buffer(\'€\').length')
pEval('JavaScript Unicode escape:', 'new Buffer(\'€\').toString()')
pEval('Byte values:', 'var s = [], b = new Buffer(\'€\'); for (var i = 0; i <b.length; i++) s.push(b[i]); s.join(\',\')')
pEval('encodeURIComponent outputs those exact bytes', 'encodeURIComponent(\'€\')')
