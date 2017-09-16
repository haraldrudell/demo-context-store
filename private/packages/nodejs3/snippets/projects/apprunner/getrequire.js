// getrequire.js
// provides api lifecycle
// © Harald Rudell 2012

// list of overrides - always intercept these
// list of module locations

//var getemitter = require('./getemitter')
//var rqsm = require('./rqs')

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var apiConfig
var appName = 5

exports.getRequire = getRequire
exports.init = init

function stats() {
	require('haraldutil').p('has apis:', !!apiConfig, appName)
}
/*
get a replacement require function that faciliates load of api
theRequire: function: original require function
theExports: optional object with initApi property: used for intercepting the initApi export
opts: object
.api: non-zero string: unique api name
.initApi: optional function: the internal initApi implementation
.rqScope: optional string or boolen, slogan for request timer, true if using api name
.cb(err): optional function: rqs error callback
.timeoutMs: number ms: default rqs timeout if not 3 seconds
*/
function getRequire(theRequire, theExports, opts) {
require('haraldutil').p('has apis:', !!apiConfig, appName)
	var theInitApi
stats()
	// obtain replacement require
	if (typeof theRequire != 'function') throw Error(arguments.callee.name + ' invoked with require argument not function')
	var result = apiRequire

	// get emitter
	result.emitter = getemitter.getEmitter(opts)
	var apiName = result.emitter.id

	// get rqs
	if (opts.rqScope) {
		var scopeName = opts.rqScope !== true ? opts.rqScope : apiName
		var errorCallback = typeof opts.cb == 'function' ? opts.cb : defaultError
		var timeoutMs = opts.timeoutMs != null ? opts.timeoutMs : undefined
		// getRqs may throw
		result.rqs = rqsm.getRqs(errorCallback, scopeName, timeoutMs)
	}

	// wrap initApi
	if (opts.initApi) {
		if  (typeof opts.initApi != 'function') throw Error(arguments.callee.name + ' invoked with opts.initApi not function')
		if (!(theExports instanceof Object)) throw Error(arguments.callee.name + ' invoked with exports not object')
		theInitApi = opts.initApi
		theExports.initApi = initApiWrapper
		theExports = null
	}

	return result

	function apiRequire(moduleName) {
require('haraldutil').p(moduleName, 'has apis:', !!apiConfig, appName)
		// look for overrides
		// require the default
		// look in path if module not found
		return theRequire(moduleName)
	}

	function initApiWrapper(opts) {
require('haraldutil').p('has apis:', !!apiConfig, appName)
require('haraldutil').p('has apis:', !!apiConfig.expect)

		// replace opts, override with apiConfig options
		var config = haraldutil.merge(haraldutil.shallowClone(apiConfig[apiName]), opts)
		var opts = {
			config: config, // configuration for this api
			//registerHandler: registerRoute, // register web routes
			logger: config.noLog ? function () {} : console.log,
			apprunner: require('./apprunner'), // this require needs to be delayed
			appName: appName,
		}

		theInitApi(opts)
	}
}

function init(apiOpts, appName0) {
require('haraldutil').p('has apis:', !!apiOpts.apiMap.expect, appName)
	if (!apiOpts) apiOpts = {}
	apiConfig = apiOpts.apiMap || {}
	appName = appName0
require('haraldutil').p('has apis:', !!apiConfig.expect, appName)
stats()
}

function defaultError() {}