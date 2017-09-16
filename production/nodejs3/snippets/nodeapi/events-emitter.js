// emitter.js
// Demonstrate class featuring emitting events
// © 2013 Harald Rudell <harald@therudells.com> All rights reserved.

// http://nodejs.org/api/events.html
var events = require('events')
// http://nodejs.org/api/util.html
var util = require('util')

exports.Emitter = Emitter

function Emitter() {
	var self = this
	events.EventEmitter.call(this)
}
util.inherits(Emitter, events.EventEmitter)
