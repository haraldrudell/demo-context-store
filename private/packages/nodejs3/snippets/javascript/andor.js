// andor.js
// examine aspects of the and and or JavaScript operators

// http://nodejs.org/api/path.html
var path = require('path')

console.log(
	path.basename(__filename,
		path.extname(__filename)))

console.log('The or operator || actually returns value and type, not boolean:')
console.log('\'abc\' || \'def\':', 'abc' || 'def')
console.log('false || \'def\':', false || 'def')

console.log('to examine a.b.c where any value can be undefined:')
a = {}
console.log('(a is empty object) a && a.b && a.b.c || \'default value\':', a && a.b && a.b.c || 'default value')
console.log('(a is empty object) a && a.b && a.b.c:', a && a.b && a.b.c)
a.b = { c: 'a.b.c value' }
console.log('(a.b.c exists) a && a.b && a.b.c || \'default value\':', a && a.b && a.b.c || 'default value')
