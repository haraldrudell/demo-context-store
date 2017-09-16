// objectobject.js
// © 2012 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
15.2 Object Objects

15.2.3 Properties of the Object constructor
properties can be enumerable, configurable, writable
Object.prototype
Object.getPrototypeOf(O)
Object.getOwnPropertyDescriptor(O, P)
Object.getOwnPropertyNames(O)
Object.create(O, Ps)
Object.defineProperty(O, P, Attributes)
Object.defineProperties(O, Ps)
Object.seal(O)
Object.freeze(O)
Object.preventExtensions(O)
Object.isSealed(O)
Object.isFrozen(O)
Object.isExtensible(O)
Object.keys(O) - only enumerable properties, not prototype chain

15.2.4 properties of the Object Prototype Object
Object.prototype.constructor
Object.prototype.toString( )
Object.prototype.toLocaleString ( )
Object.prototype.valueOf ( )
Object.prototype.hasOwnProperty (V)
Object.prototype.isPrototypeOf (V)
Object.prototype.propertyIsEnumerable (V)

__proto__ is the prototype chain, initalized when the object was created
prototype is the object a function would use as prototype if it was invoked with new
constructor (__proto__.constructor) is the function that created an object (informational only.)
*/

var jsutil = require('./jsutil')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
1.      Empty object literal
  1.1   Has the default Object constructor: ({}).constructor
        function Object()
  1.2   Gets its prototype chain from Object: ({}).__proto__ === Object.prototype
        true
  1.3   Has no own properties: Object.getOwnPropertyNames({})
        []
  1.4   Has a single the default prototype chain: ({}).__proto__
        {
  (nonE)constructor: function Object() {
    (nonE)isSealed: function isSealed(),
    (nonE)isFrozen: function isFrozen(),
    (nonE)freeze: function freeze(),
    (nonE)getOwnPropertyNames: function getOwnPropertyNames(),
    (nonE)getPrototypeOf: function getPrototypeOf(),
    (nonE)is: function is(),
    (nonE)keys: function keys(),
    (nonE)defineProperties: function defineProperties(),
    (nonE)isExtensible: function isExtensible(),
    (nonE)preventExtensions: function preventExtensions(),
    (nonE)defineProperty: function defineProperty(),
    (nonE)getOwnPropertyDescriptor: function getOwnPropertyDescriptor(),
    (nonE)seal: function seal(),
    (nonE)create: function create()
  },
  (nonE)__defineGetter__: function __defineGetter__(),
  (nonE)__defineSetter__: function __defineSetter__(),
  (nonE)isPrototypeOf: function isPrototypeOf(),
  (nonE)__lookupGetter__: function __lookupGetter__(),
  (nonE)toLocaleString: function toLocaleString(),
  (nonE)__lookupSetter__: function __lookupSetter__(),
  (nonE)toString: function toString(),
  (nonE)hasOwnProperty: function hasOwnProperty(),
  (nonE)propertyIsEnumerable: function propertyIsEnumerable(),
  (nonE)valueOf: function valueOf()
}
  1.5   Has no second link in its prototype chain: ({}).__proto__.__proto__
        null
*/
p('Empty object literal', true)
pEval('Has the default Object constructor', '({}).constructor')
pEval('Gets its prototype chain from Object', '({}).__proto__ === Object.prototype')
pEval('Has no own properties', 'Object.getOwnPropertyNames({})')
pEval('Has a single the default prototype chain', '({}).__proto__', undefined, [haraldutil.inspectDeep({}.__proto__)], true)
pEval('Has no second link in its prototype chain', '({}).__proto__.__proto__')

p('Property descriptor', true)
pEval('Default undefined, read-only, non-enumerable', 'var o = {}; var propName = \'x\'; Object.defineProperty(o, propName, {}); Object.getOwnPropertyDescriptor(o, propName)')
pEval('Normal: read-write, enumerable', 'var o = {x: 1}; var propName = \'x\'; Object.getOwnPropertyDescriptor(o, propName)')


p('Old Stuff', true)

// Object is the function creating Object objects
// Object.prototype can not be overwritten
console.log('Object.prototype before:', Object.prototype)
Object.prototype = null
console.log('Object.prototype:', Object.prototype)

// Can I destroy the prototype for my own constructor? no
var F = function FF() { console.log('FF') }
F.prototype = null
console.log('F.prototype:', F.prototype)
var o2 = new F()
console.log('No properties?', Object.getOwnPropertyNames(o2.__proto__).length)

// however, I can destroy an object instance
o2.__proto__ = null
// TypeError: Object #<error> has no method 'valueOf'
//console.log(o2.valueOf())
// TypeError: Object.getOwnPropertyNames called on non-object
//console.log('No properties?', Object.getOwnPropertyNames(o2.__proto__).length)
var o = {}
o.__defineGetter__('a', function() { return 5})
console.log('a is:', o.a, o.__defineGetter__('b', function() { return 5}))
console.log({})