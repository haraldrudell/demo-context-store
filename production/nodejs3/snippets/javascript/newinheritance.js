// newinheritance.js
// Prototype-based inheritance
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
4.2.1 Objects
11.2.2 The new Operator
13.2.2 [[Construct]]
- Only the original constructor is executed by default
- Object.create creates prototype chains
*/

var jsutil = require('./jsutil')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var p = jsutil.p
var pEval = jsutil.pEval
var i = jsutil.i

jsutil.pFileHeader()

/*
1.      Prototype-based inheritance
  1.1   Inheritance provides finding named properties over a prototype chain and the instanceof operator
  1.2   Inheritance is established by the new operator using the constructor's prototype property
  1.3   The new object's prototype chain is defined by Constructor.prototype's prototype.
  1.4   The only code new executes by default is Constructor: var a = []; function Base() {a.push(arguments.callee.name)}; function Constructor() {a.push(arguments.callee.name)}; function PrototypeConstructor() {a.push(arguments.callee.name)}; Constructor.prototype = Object.create(Base.prototype, {constructor: {value: PrototypeConstructor, enumerable: false, writable: true, configurable: true}}); var c = new Constructor; a.push(c, 'isConstructor:' + (c instanceof Constructor), 'isPrototypeConstructor:' + (c instanceof PrototypeConstructor), 'isBase:' + (c instanceof Base)); inspect(a)
        ['Constructor', object:PrototypeConstructor {-- prototype: PrototypeConstructor, -- prototype: Base}, 'isConstructor:true', 'isPrototypeConstructor:false', 'isBase:true', (nonE)length: 5]
*/
p('Prototype-based inheritance', true)
p('Inheritance provides finding named properties over a prototype chain and the instanceof operator')
p('Inheritance is established by the new operator using the constructor\'s prototype property')
p('The new object\'s prototype chain is defined by Constructor.prototype\'s prototype.')
pEval('The only code new executes by default is Constructor', 'var a = []; function Base() {a.push(arguments.callee.name)}; function Constructor() {a.push(arguments.callee.name)}; function PrototypeConstructor() {a.push(arguments.callee.name)}; Constructor.prototype = Object.create(Base.prototype, {constructor: {value: PrototypeConstructor, enumerable: false, writable: true, configurable: true}}); var c = new Constructor; a.push(c, \'isConstructor:\' + (c instanceof Constructor), \'isPrototypeConstructor:\' + (c instanceof PrototypeConstructor), \'isBase:\' + (c instanceof Base)); inspect(a)',
	undefined, undefined, true)

/*
2.      Object.create
  2.1   Object.create creates objects with a specific prototype and possibly hidden properties.
  2.2   Object.create must be used if __proto__ is not available.
  2.3   Using util.inherit: function Base() {}; Base.prototype.base = 1; function Sub() {Base.call(this)}; Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}}); Sub.prototype.sub = 2; inspect(new Sub)
        'object:Sub {-- prototype: Sub, sub: 2, -- prototype: Base, base: 1}'
  2.4   Without Object.create Base prototype is not present: function Base() {}; Base.prototype.base = 1; function Sub() {Base.call(this)}; Sub.prototype.sub = 2; haraldutil.inspectDeep(new Sub)
        'object:Sub {\n  -- prototype: Sub,\n  sub: 2\n}'
  2.5   indirect invocation of constructor: function Base() {}; Base.prototype.base = 1; function Sub() {Base.call(this)}; Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}}); Sub.prototype.sub = 2; var sub = Sub.bind.apply(Sub, [1, 2]); inspect(new sub)
        object:Sub {-- prototype: Sub, sub: 2, -- prototype: Base, base: 1}
*/
p('Object.create', true)
p('Object.create creates objects with a specific prototype and possibly hidden properties.')
p('Object.create must be used if __proto__ is not available.')
pEval('Using util.inherit', 'function Base() {}; Base.prototype.base = 1; function Sub() {Base.call(this)}; Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}}); Sub.prototype.sub = 2; inspect(new Sub)')
pEval('Without Object.create Base prototype is not present', 'function Base() {}; Base.prototype.base = 1; function Sub() {Base.call(this)}; Sub.prototype.sub = 2; haraldutil.inspectDeep(new Sub)')
pEval('indirect invocation of constructor', 'function Base() {}; Base.prototype.base = 1; function Sub() {Base.call(this)}; Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}}); Sub.prototype.sub = 2; var sub = Sub.bind.apply(Sub, [1, 2]); inspect(new sub)',
	undefined, undefined, true)

/*
3.      Function object as constructor
  3.1   A function is invoked as a constructor with the new operator: function F() {}; new F
        object:F {}
  3.2   When invoked as a constructor, the this value refers to a newly created object: var a; function F() {a = this}; new F; a
        object:F {}
  3.3   The objects internal Prototype property is set to the constructor's prototype property: var a; function F() {a = this.__proto__ === F.prototype}; new F; a
        true
  3.4   The object's constructor property refers to the constructor function: var a; function F() {a = this.constructor === F}; new F; a
        true
  3.5   If a constructor returns an object value, that value is used as result of the new operator instead of the this value: function F() {return {a: 1}}; new F
        {a: 1}
*/
p('Function object as constructor', true)
pEval('A function is invoked as a constructor with the new operator', 'function F() {}; new F')
pEval('When invoked as a constructor, the this value refers to a newly created object', 'var a; function F() {a = this}; new F; a')
pEval('The objects internal Prototype property is set to the constructor\'s prototype property', 'var a; function F() {a = this.__proto__ === F.prototype}; new F; a')
pEval('The object\'s constructor property refers to the constructor function', 'var a; function F() {a = this.constructor === F}; new F; a')
pEval('If a constructor returns an object value, that value is used as result of the new operator instead of the this value', 'function F() {return {a: 1}}; new F')

/*
4.      Construct
  4.1   The internal Construct property is only used by and required for the new operator
  4.2   An object that has Construct is a constructor
  4.3   All created function objects are constructors
  4.4   The global object, JSON and built-in functions that are not constructors do not have Construct
*/
p('Construct', true)
p('The internal Construct property is only used by and required for the new operator')
p('An object that has Construct is a constructor')
p('All created function objects are constructors')
p('The global object, JSON and built-in functions that are not constructors do not have Construct')

/*
5.      prototype
  5.1   When new creates an object, the object's internal Prototype property is set to the constructor's prototype property
  5.2   instanceof begins with the second argument's prototype property
*/
p('prototype', true)
p('When new creates an object, the object\'s internal Prototype property is set to the constructor\'s prototype property')
p('instanceof begins with the second argument\'s prototype property')

/*
6.      Prototype and the Prototype chain
  6.1   All objects but null has an internal Prototype property implementing the Prototype chain
  6.2   Prototype is used when searching for named properties, by instanceof and Object.prototype.isPrototypeOf
  6.3   On create, Prototype is set to the constructor's prototype property or the Prototype of Object
  6.4   All Prototype values reference an object, and the chain ends with null
  6.5   Object.getPrototypeOf(o) returns Prototype
  6.6   Webkit exposes Prototype as __proto__: Object.__proto__
        function Empty()
  6.7   an object's __proto__ can be updated: function Base() {}; Base.prototype.base = 1; function Sub() {}; Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}}); var sub = new Sub; var a = []; a.push(sub.base); sub.__proto__ = null; a.push(sub.base); a
        [1, undefined]
  6.8   an object's __proto__ can be updated: function Base() {}; Base.prototype.base = 1; function Sub() {}; Sub.prototype.__proto__ = Base.prototype; var sub = new Sub; sub.base
        1
*/
p('Prototype and the Prototype chain', true)
p('All objects but null has an internal Prototype property implementing the Prototype chain')
p('Prototype is used when searching for named properties, by instanceof and Object.prototype.isPrototypeOf')
p('On create, Prototype is set to the constructor\'s prototype property or the Prototype of Object')
p('All Prototype values reference an object, and the chain ends with null')
p('Object.getPrototypeOf(o) returns Prototype')
pEval('Webkit exposes Prototype as __proto__', 'Object.__proto__')
pEval('an object\'s __proto__ can be updated', 'function Base() {}; Base.prototype.base = 1; function Sub() {}; Sub.prototype = Object.create(Base.prototype, {constructor: {value: Sub, enumerable: false, writable: true, configurable: true}}); var sub = new Sub; var a = []; a.push(sub.base); sub.__proto__ = null; a.push(sub.base); a')
pEval('an object\'s __proto__ can be updated', 'function Base() {}; Base.prototype.base = 1; function Sub() {}; Sub.prototype.__proto__ = Base.prototype; var sub = new Sub; sub.base')

testInDebugger3()

function testInDebugger() {
	function G() {}
	G.prototype.g = 1

	function F() {
		G.call(this)
	}
	F.prototype = Object.create(G.prototype,
		{constructor: {value: F, enumerable: false, writable: true, configurable: true}}
	)
	F.prototype.f = 2
	var f = F.bind.apply(F, [1, 2])

	var f1 = new F
	var f2 = new f
	// f1 and f2 have identical properties and chains
//	debugger
}

/*
A function in the debugger has arguments, caller, length, name, prototype, __proto__
arguments and caller are usually null but initialize for functions on the callstack

A function's default prototype is an Object with 2 properties
constructor: references back to the function
__proto__: the default prototype belonging to Object
*/
function testInDebugger2() {
	function G(a) {this.g = a}

	function F(a) {
		G.call(this, a + 1)
	}
	F.prototype = Object.create(G.prototype,
		{constructor: {value: G, enumerable: false, writable: true, configurable: true}}
	)

	var f1 = new F(1)
	var f2 = new G(2)
	// f1 and f2 have identical properties and chains
//	debugger
}

function testInDebugger3() {
	var Se = SyntaxError
	var se = new SyntaxError

	var T = function () {}
	T.prototype.__proto__ = Error.prototype
	var t = new T

	/*
	The global property Error's prototype property is Error
	The global property Error's __proto__ property is Empty
	Error prototype.constructor is Error
	Error first prototype is Object
	Object does not have a prototype property
	Object.__proto__ is null

	The global property SyntaxError's prototype property is SyntaxError
	The prototype's constructor is SyntaxError, ie. itself
	The prototype's __proto__ property is Error

	*/
	require('haraldutil').p(
		'global SyntaxError is its own constructor:', SyntaxError.prototype.constructor === SyntaxError,
		'typeof prototype:', typeof SyntaxError.prototype,
		'global SyntaxError.prototype.__proto__ is Error.prototype:', SyntaxError.prototype.__proto__ === Error.prototype)
	var E = Error
	var er = new Error
	var e = new E
//debugger
}
