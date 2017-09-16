// nodeapi-events.js

// http://nodejs.org/api/events.html
var events = require('events')
var haraldutil = require('haraldutil')

/*
the only thing special about EventEmitter objects are their
prototype functions, and emit is the interesting one

you make any object an event emitter by:
events.EventEmitter.call(object)
*/
var e = new (events.EventEmitter)

/*
Properties of an event object:

1. EventEmitter object: object:EventEmitter {
  -- prototype:EventEmitter,
  removeListener:function (type, listener),
  addListener:function (type, listener),
  listeners:function (type),
  emit:function (),
  on:recursive-object#3,
  once:function (type, listener),
  setMaxListeners:function (n),
  removeAllListeners:function (type)
}
*/
console.log('1. EventEmitter object:', haraldutil.inspectDeep(e))

/*
Listeners are stored in an object _events
the value is either a function object or an array of function objects
- there is no function to listen to all events
- the emit() function needs to be overridden

2. listener storage object:EventEmitter {
  _events:{
    data:function listener()
  },
  -- prototype:EventEmitter,
  removeListener:function (type, listener),
  addListener:function (type, listener),
  listeners:function (type),
  emit:function (),
  on:recursive-object#5,
  once:function (type, listener),
  setMaxListeners:function (n),
  removeAllListeners:function (type)
}


- an event has 0 or more arguments
- this refers to the emitting object


object:EventEmitter {
	_events:{
		data:function f()
	},
...
*/
e.on('data', listener)
console.log('2. listener storage', haraldutil.inspectDeep(e))

/*
emit:
'error': if there are no listeners, an exception is thrown. If the argument is not Error, it's a generic exception
In the listener, there is no way to determine what the event is
- this is the EventEmitter object
- arguments are any arguments beyond the event type

3. Fired events: this: object:EventEmitter {
  _events:{
    data:function listener()
  },
  -- prototype:EventEmitter,
  removeListener:function (type, listener),
  addListener:function (type, listener),
  listeners:function (type),
  emit:function (),
  on:recursive-object#5,
  once:function (type, listener),
  setMaxListeners:function (n),
  removeAllListeners:function (type)
} args: 1:[5, (nonE)length:1]
*/
e.emit('data', 5)
function listener() {
	console.log('3. Fired events: this:', haraldutil.inspectDeep(this),
		'args:', haraldutil.inspectDeep(Array.prototype.slice.call(arguments)))
}
e.removeListener('data', listener)

/*
Override emit

4. emitOverride args: [ 'myevent', 2 ]
*/
var oldEmit = e.emit
e.emit = emitOverride
function emitOverride(event) {
	var args = Array.prototype.slice.call(arguments)
	console.log('4.', arguments.callee.name, 'args:', args)
	oldEmit.apply(this, args)
}

e.emit('myevent', 2)
e.emit = oldEmit