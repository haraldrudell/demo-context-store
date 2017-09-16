// myscript.js
// runs inside jsdom

(function () {
	var instanceno

	// create MYSCRIPT with a logging function
	if (typeof MYSCRIPT == 'undefined') MYSCRIPT = {}
	if (!MYSCRIPT.base) MYSCRIPT.base = Date.now()
	if (!MYSCRIPT.instances) MYSCRIPT.instances = 0
	instanceno = ++MYSCRIPT.instances
	if (!MYSCRIPT.log) {
		MYSCRIPT.str = ''
		MYSCRIPT.log = function (text, instance) {
			if (!instance) instance = ''
			MYSCRIPT.str +=
				'\nmyscript' + instance + '-' +
				text +
				':' + (Date.now() - MYSCRIPT.base) + ' ms'
		}
		MYSCRIPT.log('log-function-available', instanceno)
	}
	MYSCRIPT.log('global-variable-verified', instanceno)

	// if onload executes, log that
	if (typeof window != 'undefined') {
		var f = window.onload
		window.onload = function() {
			MYSCRIPT.log('onload', instanceno)
			if (f) f()
		}
		MYSCRIPT.onload = window.onload
		MYSCRIPT.log('onloadwas' + (f ? 'set' : 'notset'), instanceno)
	} else MYSCRIPT.log('noWindow', instanceno)
})()

// end of initial execution
MYSCRIPT.log('done')