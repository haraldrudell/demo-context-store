// requireresearch.js
// Determine how to deflect requires to a different folder
// © Harald Rudell 2012

/*
1. require(path) is defined in module:378 inside Module._compile
1a. require does self.require(path)
2. Module.require is defined in module:361
2a. it does Module._load(path, this)
3. Module._load module:275
3a. if not cached, native, it does module.load(filename). module is a new Module object
4. Module.load module:346
4a. Does Module._extensions[extension](this, filename)
4b. The return value is not used
4c. The this value will be Module._extensions, defined as an object module:56
4d. The first argument is the Module instance for the module to be loaded
4e. The second argument is the fully qualified filename with extension
*/
var p = require('haraldutil').p
var pargs = require('haraldutil').pargs

// intercept require for JavaScript
var jsExtension  = '.js'
var originalRequire = require.extensions[jsExtension]
require.extensions[jsExtension] = requireFilter

// require something that has not been required yet
require('./dummyjsmodule')

/*
invoked for every require of a not previously loaded module
- not invoked for native modules, only when loading from the filesystem
module: module object
.id: string
.exports: object
.parent: object
.filename: string
.loaded: boolean
.children: array
.paths: array of string
filename: absolute filename with extension eg. '/folder/module.js'
return value:
*/
function requireFilter(module, filename) {
	p(pargs(arguments))
	/*
	if (filename.substring(0, folder1.length) != folder1 &&
		filename.substring(0, folder0.length) == folder0) {

		// patch filename
		filename = folder1 + filename.substring(folder0.length)
	}
	*/
	return originalRequire.apply(this, Array.prototype.slice.call(arguments))
}