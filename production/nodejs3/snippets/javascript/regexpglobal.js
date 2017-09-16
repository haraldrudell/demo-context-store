// regexpglobal.js
// how to use the global flag of JavaScript regular expressions
// © Harald Rudell 2012 <harald@therudells.com> All rights reserved.

var p = require('./jsutil').p
var pEval = require('./jsutil').pEval

p('The global flag of JavaScript regular expressions')

/*
1.   The global flag is only effective when using regExp.text and regExp.exec.
     The regExp must be in a variable, otherwise the effect of the global flag is lost.
     To utilize the global flag, the functions are invoked repeatedly until false or null is returned.
1a.  regExp.test: var regExp = /a/g, a, b = []; while (a !== false) b.push(a = regExp.test('a a b a a')); b
     5[true, true, true, true, false]
1b.  regExp.exec: var regExp = /a/g, a, b = []; while (a !== null) b.push(a = regExp.exec('a a b a a')); b
     5[1['a', index: 0, input: 'a a b a a'], 1['a', index: 2, input: 'a a b a a'], 1['a', index: 6, input: 'a a b a a'], 1['a', index: 8, input: 'a a b a a'], null]
*/
p('The global flag g enables mathes other than the first to be found.', true)
p('The global flag is only effective when used with regExp.test and regExp.exec.', true)
p('The global flag is only effective when the regular expression is in a variable, not a literal.', false)
p('The regExp variable has internal hidden state that has to be reset for a fresh search.', false)
p('The functions are invoked repeatedly until false (.test) or null (.exec) is returned.', false)
pEval('regExp.test', 'var regExp = /a/g, a, b = []; while (a !== false) b.push(a = regExp.test(\'a a b a a\')); b')
pEval('regExp.exec', 'var regExp = /a/g, a, b = []; while (a !== null) b.push(a = regExp.exec(\'a a b a a\')); b')
p('The only way to do obtain capture groups with global matches is regExp.exec.')
// string.match behaves differently with global flag
// maybe other functions do, too