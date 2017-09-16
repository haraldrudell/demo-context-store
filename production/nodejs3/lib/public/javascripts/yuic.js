// yuic.js
if (typeof YUI == 'undefined') alert('yui script not loaded')

/*
Yahoo! user interface defines a single global property YUI

use method: 
http://yuilibrary.com/yui/docs/api/classes/YUI.html#method_use
Y is a YUI instance created for this sandbox

Module: console
http://yuilibrary.com/yui/docs/api/classes/Console.html

Module: console-filters: a plugin
http://yuilibrary.com/yui/docs/api/classes/Plugin.ConsoleFilters.html

Module: dd: drag and drop
http://yuilibrary.com/yui/docs/api/modules/dd.html
*/
YUI().use("console", "console-filters", "dd-plugin", function (Y) {

	var basic = new Y.Console({
		style: 'block' // keeps the Console in the page flow as a block element
	}).render( "#basic" ) // note the inline render()

	newOnBottom = new Y.Console({
		style: 'inline', // keeps the Console in the page flow as an inline element
		newestOnTop: false,
		visible: false   // hidden at instantiation
	}).render( "#add_to_bottom" )

	customStrings = new Y.Console({
		strings: {
			title : 'Console with custom strings!',
			pause : 'Wait',
			clear : 'Flush',
			collapse : 'Shrink',
			expand : 'Grow'
		},
		visible: false  // hidden at instantiation
	}).plug(Y.Plugin.ConsoleFilters)
		.plug(Y.Plugin.Drag, { handles: ['.yui3-console-hd'] })
		.render()

	// Set up the button listeners
	function toggle(e,cnsl) {
		if (cnsl.get('visible')) {
			cnsl.hide();
			this.set('innerHTML','show console');
		} else {
			cnsl.show();
			cnsl.syncUI(); // to handle any UI changes queued while hidden.
			this.set('innerHTML','hide console');
		}
	}

	// click on #info #warn #error
	// this: the clicked element
	function report(e,type) {
		Y.log(this.get('value'),type)
		e.preventDefault()
	}

	// Display a message in the Console for reference
	Y.log("Click the buttons below to log messages");

	// on(type, fn, [context], [arg*])
	// type: name of event, eg. 'click'
	// fn: callback function in your code
	// context: this value
	// arg: additional arguments provided to fn
	// Pass the corresponding Console instance to the handler as a second arg
	Y.on('click', toggle, '#toggle_basic', null, basic)
	Y.on('click', toggle, '#toggle_atb', null, newOnBottom)
	Y.on('click', toggle, '#toggle_cstrings', null, customStrings)

	// Set the context of the event handler to the input text node
	// for convenience and pass the message type as a second arg
	Y.on('click', report, '#info', Y.one('#info_text'),  'info')
	Y.on('click', report, '#warn', Y.one('#warn_text'),  'warn')
	Y.on('click', report, '#error', Y.one('#error_text'), 'error')

})