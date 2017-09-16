// createwritestream.js
// display events for fs.createWriteStream

// http://nodejs.org/api/fs.html
var fs = require('fs')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
minimum
events: drain error
properties: writable
functions: write end destroy
*/

/*
fs.createWriteStream(path, options)
creates a new object (new WriteStream)

this.path = path string filename
this.fd = null. number null -1 means failure, integer 0-1-2=stdio
this.writable = true. if false the stream has completed
this.flags string 'w'
this.encoding = 'binary' - thiss is not used. write has  its own encoding
this.mode number 438 (0666 rw-rw-rw-)
this.bytesWritten = 0
this.start number
this.pos
this.busy false. true during when flush has a pending operation on the file
this.drainable boolean undefined: set to true on the first write. then on _queue becoming empty, drain is emitted
options: optional object. each property is added to this
this._queue array of array. [fn ... cb/undefined]
all operations go through the queue and is executed in the flush function
if an operation results in error, error is emitted after fs.close. An fs.close error is ignored.
On error flush operations cease. There might still be operations in _queue, but the file descriptor is closed.

events
optional: drain when write buffer empty
open fd emitted if an open was called in the constructor
close successful final event
error Error final event, might be several

behavior
drain is not emitted unless one write was invoked
destroy

write(data, encoding, cb)
emits error if stream not writable, sets drainable
data: if not Buffer converted to string using utf8 encoding
encoding: optional string 'utf8'
cb: optional function
return value: false

flush()
executes next queued operation even if writable is false, ie. each queued operation produces its own error event

end(data, encoding, cb)
does the write, enqueues a close, sets writable false

destroySoon() same as end

destroy(cb)
cb(err): optional function
emits error or close. always after nextTick. flush operations may still be ongoing.

setEncoding(encoding)
encoding: string 'utf8'
characters removed from encoding: [-_]
*/
console.log('Regular event pattern')
console.log('invoking create')
var cws = fs.createWriteStream('/dev/null')
/*
{
  path:'/dev/null',
  fd:null,
  bytesWritten:0,
  encoding:'binary',
  busy:true,
  writable:true,
  _open:function (path, flags, mode, callback),
  mode:438,
  flags:'w',
  _queue:0:[(nonE)length:0],
  -- prototype,
  flush:function (),
  end:function (data, encoding, cb),
  write:function (data),
  destroySoon:recursive-object#5,
  destroy:function (cb),
  -- prototype:Stream,
  pipe:function (dest, options),
  -- prototype:EventEmitter,
  removeListener:function (type, listener),
  addListener:function (type, listener),
  listeners:function (type),
  emit:function (),
  on:recursive-object#10,
  once:function (type, listener),
  setMaxListeners:function (n),
  removeAllListeners:function (type)
}
*/
//console.log(haraldutil.inspectDeep(cws))
var cwsUnwrapEmit = wrapEmit(cws)

/*
drain is only emitted if there was a write

Event: open 7
nextTick
invoking write
Event: drain
nextTick
invoking end
Event: close
*/
//cws.destroy() leads to close event, write, end throws exception
//cws.destroySoon() leads to close event, write throws exception
process.nextTick(writeData)

function writeData() {
	console.log('nextTick')

	console.log('invoking write')
	cws.write('abc')
	process.nextTick(invokeEnd)
}

function invokeEnd() {
	console.log('nextTick')

	console.log('invoking end')
	cws.end()
	process.nextTick(endTick)
}

function endTick() {
	console.log('nextTick')
	cwsUnwrapEmit()

	console.log('examine destroy events')
	console.log('invoking create')
	cws = fs.createWriteStream('/dev/null')
	cwsUnwrapEmit = wrapEmit(cws)
	process.nextTick(destroyWriteTick)
}

function destroyWriteTick() {
	console.log('nextTick')
	cws.write('abc')
	process.nextTick(destroyTick)
}

function destroyTick() {
	console.log('nextTick')
	cws.destroy()
}

/*
events

Event: open 7
Event: close
*/

var inspectObj = {maxString: 20, maxProperties: 0, maxLevels: 0, nonEnum: true}
function wrapEmit(emitter, slogan) {
	var wrappedEmit = emitter.emit
	emitter.emit = emitLogger
	if (!slogan) slogan = 'Event:'
	return unwrap

	function emitLogger() {
		var args = Array.prototype.slice.call(arguments)

		var prints = [slogan, args[0]]
		for (var index in args)
			if (index > 0) prints.push(haraldutil.inspect(args[index], inspectObj))
		console.log.apply(this, prints)

		wrappedEmit.apply(this, args)
	}

	function unwrap() {
		emitter.emit = wrappedEmit
	}
}