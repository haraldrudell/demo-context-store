// getfunctionname.js

named()

// named function
function named() {
	console.log('args:', Object.getOwnPropertyNames(arguments))
	console.log('named?', arguments.callee.name || 'anonymous')
	//[Function: named]
	//console.log(arguments.callee)

	//[Function: named]
	//console.log(arguments.callee.valueOf())

	// function named() {...
	//console.log(arguments.callee.toString())

	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	// named: named 5
	console.log('named:', str, str.length)
}

// anonymous function
var anonymous = function() {
	console.log('anonymous?', arguments.callee.name || 'anonymous')

	//[Function]
	//console.log(arguments.callee)

	//[Function]
	//console.log(arguments.callee.valueOf())

	// function () {...
	//console.log(arguments.callee.toString())

	var str = arguments.callee.toString()
	str = str.substring(9, str.indexOf('(')) || 'anonymous'
	// anonymous: anonymous 9	
	console.log('anonymous:', str, str.length)
}
anonymous()