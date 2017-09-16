// varrequire.js

var r0 = require

/*
This statement works
- getRequire consumes the original require function
- a non-global require variable holds the new require function
it works because require is an argument in the invisible function wrapping this module
that means require is already defined in this function scope
We must assume that require has already been defined.
We can not declare a new require variable.

Therefore, we should not have var preceding require
Without var, it will either assign an invisible require argument or require of the global object
With var, it will not work unless there is an invisible require argument in the function scope.
*/
//var require = require('apprunner').getRequire(require)
// varrequire:4 function apiRequire(moduleName) false
//require('haraldutil').p(require, require === r0)

//require = require('apprunner').getRequire(require)
// varrequire:22 function apiRequire(moduleName) false
//require('haraldutil').p(require, require === r0)

require = r0
f()

function f() {
	// this line does not work: undefined is not a function
	//var require = require('apprunner').getRequire(require)
	// unless defined in the current function scope before var require, the require function invocation will be to undefined

	var x = 3;
	require = require('apprunner').getRequire(r0)
	// varrequire:30:f function apiRequire(moduleName) false
	require('haraldutil').p(require, require === r0)
}