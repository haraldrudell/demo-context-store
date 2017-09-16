// objecttype.js

proto()
instanceOf() // destructive
instanceOfString()
typeofString()
typeOf()

function proto() {
	/*
	modify object's prototype chain
	prototype-1. Display type by properties: CustomType true
	prototype-2. Assign name property: CustomType true
	prototype-3. assign constructor property: Hello true
	prototype-4. assign __proto__ property: Hello false

	conclusion 1: __proto__ and __proto__.constructor can be modified
	conclusion 2: instanceof is not affected by constructor property
	*/
	var o = new CustomType
	// type by properties: CustomType
	console.log('prototype-1. Display type by properties:', o.__proto__.constructor.name, o instanceof CustomType)
	// assign constructor's name property
	var o = new CustomType
	// assign name property: CustomType
	o.__proto__.constructor.name = 'Hello'
	console.log('prototype-2. Assign name property:', o.__proto__.constructor.name, o instanceof CustomType)
	// assign constructor
	var o = new CustomType
	var c = {name: 'Hello'}
	o.__proto__.constructor = c
	// assign constructor property: Hello
	console.log('prototype-3. assign constructor property:', o.__proto__.constructor.name, o instanceof CustomType)
	// assign __proto__ property
	var o = new CustomType
	var p = {
	constructor: {
		name:'Hello'
	}
}
o.__proto__ = p
// assign __proto__ property: Hello
console.log('prototype-4. assign __proto__ property:', o.__proto__.constructor.name, o instanceof CustomType)
	function CustomType() {
	}
}

function instanceOf() {
/*
instanceof

conclusion 1: Function can be assigned
conclusion 2: this affects 'instanceof Function' but not 'typeof x == 'function''

instanceof-1. normal state typeof CustomType: function CustomType instanceof Function: true typeof Function: function
instanceof-2. Function assigned typeof CustomType: function CustomType instanceof Function: false typeof Function: function

*/
console.log('instanceof-1. normal state',
	'typeof CustomType:', typeof CustomType,
	'CustomType instanceof Function:', CustomType instanceof Function,
	'typeof Function:', typeof Function)
	func = Function
	Function = Other
	console.log('instanceof-2. Function assigned',
	'typeof CustomType:', typeof CustomType,
	'CustomType instanceof Function:', CustomType instanceof Function,
	'typeof Function:', typeof Function)
	Function = func
	function CustomType() {
	}
	function Other() {
	}
}

// assigning String breaks 
function instanceOfString() {
	var s = ''
	string = String
	String = CustomType
	var k = s instanceof String
	String = string
	// Assigning String breaks instanceof String false
	console.log('Assigning String breaks instanceof String: s instanceof String:', k)
	function CustomType() {
	}
}

function typeofString() {
	var s = ''
	s.constructor = {
		name: 'Hello'
	}
	console.log('string-1. A string\'s constructor can not be assigned:',
		'typeof:', s != null && typeof s.valueOf(),
		'constructor.name:', s.constructor.name)
	s.__proto__ = {
		constructor: {
			name:'Hello',
		}
	}
	console.log('string-2. A string\'s __proto__ can not be assigned:',
		'typeof:', s != null && typeof s.valueOf(),
		'constructor.name:', s.constructor.name)

}

/*
wrapping a function as an Object
unlike primitives, this does nothing
*/
function typeOf() {
	var x = Object(CustomType)
	console.log(typeof x, typeof typeof x)
	function CustomType() {
	}
}