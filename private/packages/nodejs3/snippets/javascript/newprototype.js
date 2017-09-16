// newprototype.js
// new and the prototype property
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
11.2.2 The new Operator
13.2.2 [[Construct]]
*/
var jsutil = require('./jsutil')

var p = jsutil.p
var pEval = jsutil.pEval
var log = console.log

jsutil.pFileHeader()

/*
1.      new and the constructor's prototype property
  1.1   Objects has a prototype chain used by the instanceof operator and when searching for properties
  1.2   The Argument (constructor) must be function or TypeError is thrown: var x;try{new undefined}catch(e){x=e};x.toString()
        'TypeError: undefined is not a function'
  1.3   At construction, the object's internal prototype property is set to constructor's prototype property: function F() {}; F.prototype = {a:1}; f = new F; f.a
        1
  1.4   The prototype chain consists of references: var pr = {a: 1}; function F() {}; F.prototype = pr; f = new F; pr.a = 3; f.a
        3
  1.5   Prototype properties are not modified: var pr = {a: 1}; function F() {}; F.prototype = pr; f = new F; f.a = 3; [pr.a, f.a]
        2[1, 3]
*/
p('new and the constructor\'s prototype property', true)
p('Objects has a prototype chain used by the instanceof operator and when searching for properties')
pEval('At construction, the object\'s internal prototype property is set to constructor\'s prototype property', 'function F() {}; F.prototype = {a:1}; f = new F; f.a')
pEval('The prototype chain consists of references', 'var pr = {a: 1}; function F() {}; F.prototype = pr; f = new F; pr.a = 3; f.a')
pEval('Prototype properties are not modified', 'var pr = {a: 1}; function F() {}; F.prototype = pr; f = new F; f.a = 3; [pr.a, f.a]')

/*
2.      Creating non-enumerable properties
  2.1   For iterates over the prototype chain: var a = []; function F() {}; F.prototype = {a:1}; f = new F; for(var b in f)a.push(b);a
        1['a']
  2.2   For iterates only enumerable properties: var a = []; var pr = {}; Object.defineProperty(pr, "a", {enumerable: false, value: 1}); function F() {}; F.prototype = pr; f = new F; for(var b in f)a.push(b);a
        0[]
*/
p('Creating non-enumerable properties', true)
pEval('for iterates over the prototype chain', 'var a = []; function F() {}; F.prototype = {a:1}; f = new F; for(var b in f)a.push(b);a')
pEval('for iterates only enumerable properties', 'var a = []; var pr = {}; Object.defineProperty(pr, "a", {enumerable: false, value: 1}); function F() {}; F.prototype = pr; f = new F; for(var b in f)a.push(b);a')

p('Inheritance', true)
p('Inheritance consists of the prototype chain and executing the parent\'s constructor')
p('The parent\'s constructor is invoked using apply inside of the object\'s constructor with this as the this argument')
