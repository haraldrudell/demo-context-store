// unlisten.js
// Collect listeners for subsequent unlisten
// © 2013 Harald Rudell <harald@therudells.com> All rights reserved.

exports.UnListen = UnListen

function UnListen(object) {
	var self = this
	this.on = on
	this.once = once
	this.unListen = unListen
	var listeners = []

	if (typeof object.on !== 'function' ||
		typeof object.once !== 'function')
		throw new Error('UnListen argument not emitter')

	function on(e, fn) {
		return addListener('on', e, fn)
	}
	function once(e, fn) {
		return addListener('once', e, fn)
	}
	function addListener(method, e, fn) {
		if (object) {
			listeners.push({event: e, fn: fn})
			object[method](e, fn)
		}
		return self
	}
	function unListen() {
		if (object) {
			var o = object
			object = null
			var a = listeners
			listeners = null
			a.forEach(removeListener)
		}

		function removeListener(ob) {
			o.removeListener(ob.event, ob.fn)
		}
	}
}
