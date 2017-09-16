// objectprototype.js

	function A () {}
	A.prototype.ap = 'APrototypeField'

	function B() {}
	B.prototype = new A
	B.prototype.constructor = B
	B.prototype.bp = 'BPrototypeField'

	var b = new B
	b.bfield = 'bField'

console.log('b:', b,
	'b.bp:', b.bp, 'b.ap:', b.ap,
	'b constructor:', b.constructor.name,
	'b parent class:', b.__proto__.__proto__.constructor.name,
	'b keys:', Object.keys(b),
	'b props:', Object.getOwnPropertyNames(b),
	'b keys:', Object.keys(b.__proto__),
	'b props:', Object.getOwnPropertyNames(b.__proto__))

/*
PropertyDescriptor: { value: 'bField',
  writable: true,
  enumerable: true,
  configurable: true }
*/
console.log('PropertyDescriptor:', Object.getOwnPropertyDescriptor(b, 'bfield'))

	var a = new A
console.log('a:', a,
	'a.ap:', a.ap, 'a.bp:', a.bp,
	'a constructor:', a.constructor.name,
	'a parent class:', a.__proto__.__proto__.constructor.name,
	'a parent class is Object:', a.__proto__.__proto__ == Object.prototype)

var c = Object

var d = Object.__proto__