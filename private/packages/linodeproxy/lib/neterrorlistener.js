// neterrorlistener.js
// Error Listener function factory for net and http request and response objects
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

/*
Listens for errors emitted by server or client request or response objects
- If these are not listened for the app may terminate
- errors are reported as anomalies
*/

var endpointer = require('./endpointer')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')

var marker = path.basename(__filename, path.extname(__filename))

exports.addListener = addListener
exports.addListeners = addListeners

/*
opts: object
.reqRes: request or response object
.slogan: optional string, default marker: describing reqRes
.emitter: object: emitter for errors
.useHeaders: optional boolean default true: use forwarding headers
.isHead: optional boolean default false: ignore instanceof Error, message socket hang up, code ECONNRESET

return value: function that unwraps
*/
function addListener(opts) {
	opts = haraldutil.merge(opts)
	if (opts.reqRes && typeof opts.reqRes.on === 'function' &&
		opts.emitter && typeof opts.emitter.emit === 'function') {
		opts.reqRes.on('error', forwardNetError)
		opts.slogan = opts.slogan ? String(opts.slogan) : marker
		var invocation = new Error(marker)
		var netClass = opts.reqRes.constructor && opts.reqRes.constructor.name || 'unknown'
		var address = endpointer.getInfo(opts.reqRes, opts.useHeaders)
	} else throw new Error('Bad arguments')

	return unwrap

	function forwardNetError(e) {
		if (!opts.isHead ||
			!e || e.code !== 'ECONNRESET') {
			var args = Array.prototype.slice.call(arguments)
			var o = {
				slogan: opts.slogan,
				netClass: netClass,
				invocation: invocation,
				address: address
			}

			if (!(e instanceof Error)) {
				o.initialErrorValue = e
				e = args[0] = new Error(marker + ' not instanceof Error')
			}
			e[marker] = o
			args.unshift('error')
			opts.emitter.emit.apply(opts.emitter, args)
		}
	}
	function unwrap() {
		opts.reqRes.removeListener('error', forwardNetError)
	}
}

/*
opts: object
.request
.response
.emitter
.slogan
.useHeaders

return value: array of function
*/
function addListeners(opts) {
	var result = []

	opts = haraldutil.merge(opts)
	var request = opts.request
	var response = opts.response
	opts.slogan = (opts.slogan || 'Request')
	if (opts.reqRes = request) {
		opts.slogan += ': ' + endpointer.getInfo(request)
		opts.isHead = request.method === 'HEAD'
		result.push(addListener(opts))
	}
	if (opts.reqRes = response) result.push(addListener(opts))

	return result
}
