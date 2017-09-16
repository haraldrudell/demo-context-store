// consoletee.js
// see if console.log can be both printed and redirected to a file

// goal is to intercept console.log
// and additionally copy the output to a file

// http://nodejs.org/docs/latest/api/stream.html#stream_writable_stream
// stream.write

// TODO understand stream error handling, exceptions on node shutdown

// http://nodejs.org/docs/latest/api/process.html#process_process_stdout
var fs = require('fs')

var c = console
var p = process

// parameters
var filename = './log.log'
var writeStreamFlags = {
	flags: 'a', encoding: 'utf-8', mode: 0666,
}

var globalStream

createFile(filename,	// create the log file
	teeconsole,	// tee it to the console
	testLog,	// write a little to the log
	closeFile) // untee and close

// create the file we will be copying to
// default mode 0666: -rw-rw-rw
// fs.open throws exceptions
function createFile(filename, callback) {
	console.log('createFile')

	// convert the arguments object to an array
	var argumentsArray = Array.prototype.slice.call(arguments)

	try {
		// a writeable stream is an Object object with a queue array
		// it features deferred writing
		var logStream = fs.createWriteStream(filename, writeStreamFlags)
		if (!logStream) badResult('createWriteStream failed', null)
		globalStream = logStream

		if (callback) {
			// remove filename and callback arguments
			// insert fd argument
			argumentsArray.splice(0, 2)
			// invoke callback with our this and any additional arguments
			callback.apply(this, argumentsArray)
		}
	} catch(e) {
		badResult('exception', e)
	}

	function badResult(event, e) {
		errorLog('createFile:', event, e)
	}
}

// tee console.log to file descriptor fd
function teeconsole(callback) {
	console.log('teeconsole')
	var argumentsArray = Array.prototype.slice.call(arguments)

	// intercept stdout.write and stderr.write
	// because they are getters, we can not modify them directly
	// however, we can:
	// a. copy the current value
	// b. modiy our copy
	// c. replace getter with our own

	// get a copy of the current stdout: a WriteStream object
	// we want to intercept the function stdout.write
	var stdout = process.stdout
	var stderr = process.stderr

	// insert our write function
	stdoutWrite = stdout.write
	stdout.write = myWrite
	stderrWrite = stderr.write
	stderr.write = myErrWrite

	// publish our modified stdout to the world	
	// because stdout.write is a getter, we can not directly modify it
	// however, we can define our own getter
	process.__defineGetter__('stdout', function() {
		return stdout
	})
	process.__defineGetter__('stderr', function() {
		return stdout
	})

	if (callback) {
		argumentsArray.splice(0, 1)
		callback.apply(this, argumentsArray)
	}

	// my function for write to stdout
	// the this value does not necessarily reference stdout
	// signature: write(string, [encoding], [fd])
	function myWrite() {
		//console.log('myWrite:', arguments)
		var argumentsArray = Array.prototype.slice.call(arguments)

		// tee to log file
		if (globalStream) {
			globalStream.write.apply(globalStream, argumentsArray)
		}

		// invoke the original stdout.write
		// provide our same this and arguments
		stdoutWrite.apply(this, argumentsArray)
	}

	function myErrWrite() {
		var argumentsArray = Array.prototype.slice.call(arguments)
		if (globalStream) {
			globalStream.write.apply(globalStream, argumentsArray)
		}
		stderrWrite.apply(this, argumentsArray)
	}

}

function testLog(callback) {
	console.log('testLog: 4 tests')
	console.log('1. console.log')
	console.error('2. console.error')
	process.stdout.write('3. process.stdout.write\n')
	process.stderr.write('4. process.stderr.write\n')

	if (callback) {
		var argumentsArray = Array.prototype.slice.call(arguments)
		argumentsArray.splice(0, 1)
		callback.apply(this, argumentsArray)
	}
}

function closeFile() {
	console.log('closeFile')
	var logStream = globalStream
	if (logStream) {
		globalStream = undefined
		logStream.write('end of file\n')
		// flush writes and close
		logStream.destroySoon()
	}
	//if (fd) {
	//	globalFd = undefined
	//	fs.close(fd, function(err) {
	//		if (err) console.log('gs.close', err)
	//	})
	//}
	console.log('closeFileEnd')
}

function errorLog(func, what, err) {

	// get location: "file.js:line:col"
	var where = ''
	// Error sometimes has a string stack trace in the stack property
	if (err != null && typeof err.stack == 'string') {
		var frames = err.stack.split('\n')
		if (frames.length > 1) {
			var line = frames[1]
			// the string ends with a full path:line:col
			// and sometimes a terminating end paranthesis
			var file = line.lastIndexOf('/') + 1
			var lastcolon = line.lastIndexOf(')')
			if (lastcolon == -1) lastcolon = line.length + 1
			where = line.substring(file, lastcolon)
		}
	}
	console.log(func, what, err, where)
}
