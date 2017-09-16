var outerObject = {}

// Initially has no fields: {}
// outerObject has no fields
console.log('Initially has no fields:', outerObject)

// Can add fields: { a: 1 }
// an object passed to a function can have fields modified
setField(outerObject)
console.log('Can add fields:', outerObject)
function setField(argument) {
	argument['a'] = 1
}

// Can modify fields: { a: 2 }
// an object passed to a function can have additional fields added
incrementField(outerObject)
console.log('Can modify fields:', outerObject)
function incrementField(argument) {
	argument['a']++	
}

// Assigned  argument still modify the fields: { a: 3 }
// even if the argument is assigned, fields are still modified
assignInFunction(outerObject)
console.log('Assigned argument still modify the fields:', outerObject)
function assignInFunction(argument) {
	var b = argument
	b['a']++	
}

// An assigned argument does not affect object: { a: 3 }
// argument assigned to a different object does not affect original object
assignObject(outerObject)
console.log('An assigned argument does not affect object:', outerObject)
function assignObject(argument) {
	argument = { b: 2 }
}

// Child objects can be modified, too: { a: { b: 2 } }
// If you want to protect the initial object, you have to deep copy
var outerChildObject = { b: 1 }
var outerObject = { a: outerChildObject}
console.log('initial state:', outerObject)
modifyChild(outerObject)
console.log('Child objects can be modified, too:', outerObject)
function modifyChild(argument) {
	var child = argument.a
	child.b++
}


var outerString = 'x'
appendToString(outerString)
// x the string is not changed
console.log(outerString)

var outerNumber = 1
incrementNumber(outerNumber)
// 1 the number does not change
console.log(outerNumber)



function assignObject(argument) {
	argument = { b: 2 }
}

function appendToString(str) {
	str += 'abc'
}

function incrementNumber(number) {
	number++
}
