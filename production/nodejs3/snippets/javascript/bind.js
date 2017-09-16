// bind.js
// test this and argument for bind function
// © Harald Rudell 2012

// http://nodejs.org/api/util.html
var util = require('util')

console.log('How fn.bind() affects a function\'s this value')

var globalObject = (function () {return this})()

function theFunction(a1, a2) {
	var thisValue = this === globalObject ?
		'Global object' :
		this
	console.log(header + ':', 'this:', thisValue, ' arguments:', a1, a2)
}
var thisOne = {one: theFunction}

var header = 'Invoking function as property of object'
thisOne.one('myArgument')

var header = 'Invoking function directly'
theFunction('myArgument')

var thisTwo = {two: theFunction}
var f2 = theFunction.bind(thisTwo)
var header = 'Invoking bind result'
f2('myArgument')

var f3 = theFunction.bind(thisTwo, 'bindSecondArgument')
var header = 'Invoking result from bind with one argument'
f3('myArgument')

/*
// regular invocation
console.log('before bind')
thisObject.propertyFunction(1)

// insert bind
console.log('inserting bind')
var functionValue = thisObject.propertyFunction.bind()
function interceptFunction(argument) {

}
*/