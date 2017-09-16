// instanceof.js
// Examine the instanceof operator
// © 2012 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
11.8.6 instanceof
15.3.5.3 [[HasInstance]] (V)
- instanceof only throws if second argument is not function
- instanceof has lower precedence than !, the logical not operator
*/

var jsutil = require('./jsutil')

var p = jsutil.p
var pEval = jsutil.pEval
var log = console.log

jsutil.pFileHeader()

/*
1.      instanceof
  1.1   instanceof starts with the prototype property, then uses internal prototype properties
  1.2   Second argument must be function or TypeError is thrown: var x;try{Object instanceof {}}catch(e){x=e};x.message
        'Expecting a function in instanceof check, but got function Object() { [native co...'
  1.3   The first argument can be anything, if not object result is false: undefined instanceof Error
        false
  1.4   true only if object was instantiated by a constructor with second argument in prototype chain: new SyntaxError instanceof Error
        true
*/
p('instanceof', true)
p('instanceof starts with the second argument\'s prototype property, then uses internal Prototype properties')
pEval('Second argument must be function or TypeError is thrown', 'var x;try{Object instanceof {}}catch(e){x=e};x')
pEval('The first argument can be anything, if not object result is false', 'undefined instanceof Error')
pEval('instanceof returns true only if object was instantiated by a constructor with second argument in prototype chain', 'new SyntaxError instanceof Error')

/*
2.      instanceof precedence is lower than logical not
  2.1   Parenthesis must be used: !(new Object instanceof Error)
        true
  2.2   The proper instanceof is false: new Object instanceof Error
        false
  2.3   logical not is evaluated first, so instanceof gets a Boolean argument: !new Object instanceof Error
        false
*/
p('instanceof precedence is lower than logical not', true)
pEval('Parenthesis must be used', '!(new Object instanceof Error)')
pEval('The proper instanceof is false', 'new Object instanceof Error')
pEval('logical not is evaluated first, so instanceof gets a Boolean argument', '!new Object instanceof Error')

p('instanceof can be broken', true)
pEval('instanceof can be made to throw exception', 'var a; function F() {}; F.prototype = null; try{({}) instanceof F}catch(e){a=e}a.toString()')
pEval('If constructor\'s prototype instance is changed, instanceof will not work', 'function F() {}; var f = new F; F.prototype = {}; f instanceof F')
pEval('Working example', 'function F() {}; var f = new F; f instanceof F')
