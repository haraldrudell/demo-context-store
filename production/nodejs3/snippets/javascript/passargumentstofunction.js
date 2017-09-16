// passargumentstofunction.js

var object = {
	propertyFunction: outer
}
object.propertyFunction(1, 2)

function outer(arg1, arg2) {
	console.log('outer:', this == object, arg1, arg2)

	// convert the arguments object to an array
	var argumentsArray = Array.prototype.slice.call(arguments)
	
	inner.apply(this, argumentsArray)
}

function inner(arg1, arg2) {
	console.log('inner:', this == object, arg1, arg2)
}
