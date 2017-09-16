// variablescope.js
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

var jsutil = require('./jsutil')

var p = jsutil.p
var pEval = jsutil.pEval

jsutil.pFileHeader()

p('Is an inner scope variable available to a directly invoked function and a nextTick function?', true)
outer(true)

function outer(b) {
	if (b) {
		var innerScopeVariable = 1
		process.nextTick(innerNextTick)
		innerDirect()
	}

	function innerDirect() {
		p(arguments.callee.name + ': ' + (typeof innerScopeVariable !== 'undefined' ? 'has innerScopeVariable' : 'does not have innerScopeVariable'))
	}
	function innerNextTick() {
		p(arguments.callee.name + ': ' + (typeof innerScopeVariable !== 'undefined' ? 'has innerScopeVariable' : 'does not have innerScopeVariable'))
	}
}
