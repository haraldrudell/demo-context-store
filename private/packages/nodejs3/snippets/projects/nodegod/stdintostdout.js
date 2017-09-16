// stdintostdout.js
// Test copying stdin to another stream
// © Harald Rudell 2013 MIT License

// http://nodejs.org/api/fs.html
var fs = require('fs')

var writeStream //= process.stdout
if (!writeStream) {
	try {
		writeStream = fs.createWriteStream('/dev/null')
	} catch(e) {
		console.log('opening write stream: ' + e.message)
	}
}

if (writeStream) {
	var cbCounter = 2

	var out = wrapWriteStream({
		stream: writeStream,
		done: done,
	})
	attachToReadStream({
		stream: process.stdin,
		write: getDataProcessor(out.write, 'ABC '),
		end: out.end,
		done: done,
	})
	console.log('Reading stdin until end...')
}

function getDataProcessor(outputFn, heading) {
	return processData

	function processData(data) {
		outputFn(heading + data)
	}
}

function done() {
	if (!--cbCounter) console.log('program exit.')
}

/*
Initiate reading of a read stream using utf-8, log end, error and close
opts: object
.stream readstream
.write function receiving data
.end optional function invoked on stream end
.done optional function invoked on final end or error event
.log function logger, default console.log

Three things happens to a read stream
- data events
- end event
- close or error events terminating the stream
*/
function attachToReadStream(opts) {
	var log = opts.log || console.log
	addListeners()
	opts.stream.setEncoding('utf-8') // returns undefined
	opts.stream.resume()

	function addListeners() {
		opts.stream
			.on('data', opts.write)
			.once('end', endListener)
			.once('error', errorListener)
			.once('close', closeListener)
	}

	function endListener() {
		log('read stream end.')
		if (opts.end) opts.end()
	}

	function errorListener() {
		log('read stream error:', Array.prototype.slice.call(arguments))
		removeListeners()
	}

	function closeListener() {
		log('read stream closed.')
		removeListeners()
	}

	function removeListeners() {
		opts.stream
			.removeListener('data', opts.write)
			.removeListener('end', endListener)
			.removeListener('error', errorListener)
			.removeListener('close', closeListener)
		if (opts.done) opts.done()
	}
}

/*
Log close and error for a write stream
opts: object
.stream: write stream
.log: optional function default console.log: logger
.done: optional function: invoked on close or error
*/
function wrapWriteStream(opts) {
	var log = opts.log || console.log
	addListeners()

	return {
		write: writeStream.write.bind(writeStream),
		end: end,
	}

	function addListeners() {
		opts.stream
			.once('error', errorListener)
			.once('close', closeListener)
//			.on('drain', function () {opts.log('drain')})
	}

	function end() {
		if (opts.stream !== process.stdout) opts.stream.end.apply(opts.stream, Array.prototype.slice.call(arguments))
		else {
			log('write stream complete.')
			removeListeners()
		}
	}

	function errorListener() {
		log('write stream error:', Array.prototype.slice.call(arguments))
		removeListeners()
	}

	function closeListener() {
		log('write stream closed.')
		removeListeners()
	}

	function removeListeners() {
		opts.stream
			.removeListener('error', errorListener)
			.removeListener('close', closeListener)
		if (opts.done) opts.done()
	}
}
