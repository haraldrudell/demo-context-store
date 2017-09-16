// consoleintercept.js


// intercept console.error
/*
1. the console object is a property of the global object
2. console is defined in the native module node.js
	 location node source folder /src/node.js
3. We can not reference the global object, so just define a getter
4. intercept function properties error and warn

startup.globalConsole = function() {
		global.__defineGetter__('console', function() {
			return NativeModule.require('console');
		});
	};

console.error is really console.warn in console.js
location node source folder /lib/console.js

exports.warn = function() {
	process.stderr.write(util.format.apply(this, arguments) + '\n');
};

*/
// execute the global getter console
// console is object:Object
// error field is assigned to warn in console.js
// exports.error = exports.warn;
//var myConsole = console
//console.log(typeof myConsole)
//console.error('test')
/*
{ get: [Function],
  set: undefined,
  enumerable: true,
  configurable: true }
{ value: 5, writable: true, enumerable: true, configurable: true }
{ value: [Function],
  writable: true,
  enumerable: true,
  configurable: true }

var o = { v: 5, f: function () {} }
o.__defineGetter__('g', function () { return 5 })
console.log(Object.getOwnPropertyDescriptor(o, 'g'))
console.log(Object.getOwnPropertyDescriptor(o, 'v'))
console.log(Object.getOwnPropertyDescriptor(o, 'f'))
*/

/*
Demonstrate that we can access the console object as a property of the global object
To get to the global object, use this in a function not invoked as a property
*/
notAProperty()
function notAProperty() {
	// 1a. Verify that this.console equals console: true
	console.log('1a. Verify that this.console equals console:', this.console == console)

	// 1b. Examine a normal property
	var a = {b: 1}
	var propertyDescriptor = Object.getOwnPropertyDescriptor(a, 'b')
	// 1b. Normal property: { value: 1, writable: true, enumerable: true, configurable: true }
	console.log('1b. Normal property:', propertyDescriptor)

	// 1c. (global) console property
	var propertyDescriptor = Object.getOwnPropertyDescriptor(this, 'console')
	// 1c. The global console property: { get: [Function], set: undefined, enumerable: true, configurable: true }
	console.log('1c. The global console property:', propertyDescriptor)

	// 1d. So, console is a getter. can I assign the global console property? no
	var a = console
	this.console = a
	var propertyDescriptor = Object.getOwnPropertyDescriptor(this, 'console')
	// 1d. Modified global console property: { get: [Function], set: undefined, enumerable: true, configurable: true }
	console.log('1d. Modified global console property:', propertyDescriptor)

	// 1e. Can I modify a console property? yes
	//console.error = function MyFunc() {}
	// 1e. Are console properties writable: MyFunc
	//console.log('1e. Are console properties writable:', console.error.name)

/*
	var event = new (require('events').EventEmitter)
	event.setMaxListeners(1)
	event.addListener('error', function () {})
	event.addListener('error', function () {})
	console.log(event.constructor.name)
*/
}

//**return

// get the present console.error
var consoleError = console.error

// replace the global getter
// doing the same thing and intercept .warn and .error
__defineGetter__('console', function() {
	var console = require('console')
	console.error = myConsoleError
	console.warn = myConsoleError
	return console
})

function myConsoleError() {
	// execute the logging
	// arguments is an object with numeric keys
	consoleError.apply(this, arguments)

	// print a stack trace
	var e = Error('console.error invocation')
	consoleError(e.stack)
}

console.error('console.error intercepted')
