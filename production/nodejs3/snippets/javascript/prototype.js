// prototype.js

/*
Prototype-based programming is a style of object-oriented programming
in which classes are not present, and behavior reuse (known as inheritance
in class-based languages) is performed via a process of cloning existing
objects that serve as prototypes. */

// only function objects has prototype properties
// if a function is invoked with new, that prototyper property is used or inheritance

// every object has a __proto__ property
// this property is the prototype chain and is used to resolve identifiers
// __ proto__ can be assigned.

// objects created without new have Object as constructor
// __proto__

// by assigning the __proto__ property, properties from
// another object can be referenced
var foo = {name: "foo", one: 1, two: 2}
var bar = {three: 3}
bar.__proto__ = foo
// bar.one: 1
console.log('bar.one:',bar.one)

function MyObjectMaker() {

}
var proto = MyObjectMaker.prototype
proto.getFive = function () {
	return 5
}
var o = new MyObjectMaker()
// o.getFive: 5
console.log('o.getFive:', o.getFive())

// can the prototype be updated afterwards? yes
function Maker() {
}
var maker = new Maker()
Maker.prototype.get4 = function () {
	return 4
}
console.log(maker.get4())