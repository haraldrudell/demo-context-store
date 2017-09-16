// writeexception.js
// © Harald Rudell 2013 MIT License

// http://nodejs.org/api/fs.html
var fs = require('fs')

// does process.stdout have a callback? yes
//testStdoutWriteCallback()
function testStdoutWriteCallback() {
	var stream = process.stdout
	stream.write('hey', stdoutCb)

	function stdoutCb() {
		// heywriteexception:8:stdoutCb []
		require('haraldutil').p(Array.prototype.slice.call(arguments))
	}
}

// does a fs write throw exception? not if you use a callback
//testWriteException()
function testWriteException() {
	var stream = fs.createWriteStream('/dev/null')
		.on('open', streamOpenListener)

	function streamOpenListener(fd) {
		fs.close(fd, tryWrite)
	}

	function tryWrite(err) {
		if (!err) stream.write('Hello', writeResult)
		else console.log('fsclose err', err)
	}

	function writeResult(err) {
		if (err) console.log('writeResult', err)
		stream.write('again')
	}
}

// what about stderr?
