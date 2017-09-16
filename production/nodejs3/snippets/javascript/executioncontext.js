// executioncontext.js

// when a function is executed this is called entering function code
// 10.4.3
//
// this reference
// if the executed function was a property of another object, that object is the this reference
// if the function is global, the this reference is the global object
// call and apply functions can provide an alternative this reference
// with the new keyowrd, the this reference is the newly created object
//
// closure
// if an inner function reference is returned by a parent function,
// this creates a closure
// The closure maintains variable state of variables in the parent function
// for the particular parent invocation.

// this reference
var o = { func: myglobalfunc}
// this==the-global-object
myglobalfunc()
// this==o
o.func()
// this==5
myglobalfunc.call(5)
// this-is-of-type:object,constructor:myglobalfunc
new myglobalfunc()
function myglobalfunc() {
	var result
	if (this == null) result = 'this==null'
	if (this.Infinity) result = 'this==the-global-object'
	if (this == o) result = 'this==o'
	if (this == 5) result = 'this==5'
	if (!result) {
		result = 'this-is-of-type:' + typeof this
		if (typeof this == 'object') {
			result += ',constructor:' + this.constructor.name
		}
	}
	console.log(result)
}

// a closure can be saved as a this reference
var o = new MyFunc(1)
var oo = new MyFunc(2)
// getValues: 1 2
console.log('getValues:', o.getValue(), oo.getValue())
function MyFunc(value) {
	this.getValue = function () {
		return value
	}
}

// closure example
// when the timer argument is executed
// the at-the-time of setTimeout closure parameter value is retained
// 3 2
outer(2, 100)
outer(3, 1)
function outer(value, time) {
	setTimeout(inner, time)
	function inner() {
		console.log(value)
	}
}

// closure example
var f1 = outer2(1)
var f2 = outer2(2)
var f3 = outer2(3)
// 3 2 1
console.log(f3(), f2(), f1())

function outer2(value) {
	return inner2
	function inner2() {
		return value
	}
}