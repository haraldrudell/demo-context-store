var a
// 1. if global variable undefined: ReferenceError: document is not defined
// -- typeof document != 'undefined'
// 2. if document is null: TypeError: Cannot call method 'getElementById' of null
// -- document
// 3. if getElementById is not a function: TypeError: Property 'getElementById' of object #<Object> is not a function
// -- document.getElementById instanceof Function
var document = { getElementById: 5 }
if (typeof document != 'undefined' &&
	document &&
	document.getElementById instanceof Function)
	a = document.getElementById('id')

outer()

function outer() {
	setTimeout(inner, 5)
	function inner() {
		console.log('timeout')
	}
}
console.log('end of program')

var x = [ 1 ]
if (x instanceof Array) console.log('x is Array')
if (!(x instanceof Array)) console.log('x is not Array')

var y = 5
if (y instanceof Array) console.log('y is Array')
if (!(y instanceof Array)) console.log('y is not Array')
