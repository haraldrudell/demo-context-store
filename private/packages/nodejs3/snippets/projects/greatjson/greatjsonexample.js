// greatjsonexample.js

var greatjson = require('./lib/greatjson')
var result, error

// example how to use successfully
if (!((result = greatjson.parse('17')) instanceof Error)) console.log('It works! I got:', result)

// example of parse failure
if (!((error = greatjson.parse('qwerty')) instanceof Error)) ;
else console.log(error.toString())

// example of missing comma
if (!((error = greatjson.parse('{"a":5"b":6}')) instanceof Error)) ;
else {
	console.log(error.toString())

	// printout of custom error properties
	var s = []
	for (var p in error) s.push(p + ':' + error[p])
	console.log('Error properties:', s.join(' '))
}