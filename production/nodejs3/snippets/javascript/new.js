// new.js
// Look at the new operator
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
11.2.2 The new Operator
A.3 Expressions
- precedence relating to function call and property access
- invoke constructor using bind
- detecting if constructor was invoked using the new operator
*/

var jsutil = require('./jsutil')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

/*
1.      The new operator
  1.1   The Argument (constructor) must be function or TypeError is thrown: var x;try{new undefined}catch(e){x=e};x.toString()
        'TypeError: undefined is not a function'
*/
p('The new operator', true)
pEval('The Argument (constructor) must be function or TypeError is thrown', 'var x;try{new undefined}catch(e){x=e};x.toString()')

/*
2.      New precedence
  2.1   new has higher priority than property access, new here operates on the require result: new require('events').EventEmitter()
        undefined
  2.2   Correct evaluation: new (require('events').EventEmitter)()
        object:EventEmitter {
  domain: null,
  _events: null,
  _maxListeners: 10
}
  2.3   The reason is that new memberExpression(...) has higher precedence than function call
*/
p('New precedence', true)
pEval('new has higher priority than property access, new here operates on the require result', 'new require(\'events\').EventEmitter()')
pEval('Correct evaluation', 'new (require(\'events\').EventEmitter)()')
p('The reason is that new memberExpression(...) has higher precedence than function call')

/*
3.      Construction using call or apply
  3.1   Direct invocation: haraldutil.inspectAll(new function F() {this.p = 1})
        'object:F {\n  p: 1\n}'
  3.2   Direct invocation: function F() {this.p = 1}; haraldutil.inspectAll(new F)
        'object:F {\n  p: 1\n}'
  3.3   Indirect invocation: function F() {this.p = 1}; f = F.bind.apply(F, [1, 2]); haraldutil.inspectAll(new f)
        'object:F {\n  p: 1\n}'
*/
p('Construction using call or apply', true)
pEval('Direct invocation', 'haraldutil.inspectAll(new function F() {this.p = 1})')
pEval('Direct invocation', 'function F() {this.p = 1}; haraldutil.inspectAll(new F)')
pEval('Indirect invocation', 'function F() {this.p = 1}; f = F.bind.apply(F, [1, 2]); haraldutil.inspectAll(new f)')

/*
4.      Detecting new
  4.1   examine this: var isNew; G(); function G() {isNew = this && this.constructor === G}; isNew
        false
  4.2   examine this: var isNew; new G(); function G() {isNew = this && this.constructor === G}; isNew
        true
*/
p('Detecting new', true)
pEval('examine this', 'var isNew; G(); function G() {isNew = this && this.constructor === G}; isNew')
pEval('examine this', 'var isNew; new G(); function G() {isNew = this && this.constructor === G}; isNew')

/*
5.      Delegating to contructor with variable argument list
  5.1   Delegate without arguments: var f = F.bind.apply(F); var a = new f; function F() {}; a
        object:F {}
  5.2   Delegate with arguments: var a = new f; function f() {this.constructor = F; F.apply(this)}; function F() {}; a
        object:F {
  constructor: function F()
}
  5.3   Delegate with arguments: function f(a) {F.call(this, a + 1)}; f.prototype = Object.create(F.prototype, {constructor: {value: F, enumerable: false, writable: true, configurable: true}}); var a = new f(1); function F(a) {this.a = a}; a
        object:F {
  a: 2
}
*/
p('Delegating to contructor with variable argument list', true)
pEval('Delegate without arguments', 'var f = F.bind.apply(F); var a = new f; function F() {}; a')
pEval('Delegate with arguments', 'var a = new f; function f() {this.constructor = F; F.apply(this)}; function F() {}; a')
pEval('Delegate with arguments', 'function f(a) {F.call(this, a + 1)}; f.prototype = Object.create(F.prototype, {constructor: {value: F, enumerable: false, writable: true, configurable: true}}); var a = new f(1); function F(a) {this.a = a}; a')
