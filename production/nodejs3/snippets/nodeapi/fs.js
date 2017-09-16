// fs.js
// Demonstrate Node.js' fs api
// © Harald Rudell 2012 <harald.rudell@therudells.com> All rights reserved.

var fs = require('fs') // http://nodejs.org/api/fs.html

var jsutil = require('../javascript/jsutil')
var path = require('path') // http://nodejs.org/api/path.html

var p = jsutil.p
var pEval = jsutil.pEval
var filename = path.join(__dirname, 'data', 'text.txt')

jsutil.pFileHeader()

/*
fs.rename(oldPath, newPath, callback)
fs.renameSync(oldPath, newPath)
fs.ftruncate(fd, len, callback)
fs.ftruncateSync(fd, len)
fs.truncate(path, len, callback)
fs.truncateSync(path, len)
fs.chown(path, uid, gid, callback)
fs.chownSync(path, uid, gid)
fs.fchown(fd, uid, gid, callback)
fs.fchownSync(fd, uid, gid)
fs.lchown(path, uid, gid, callback)
fs.lchownSync(path, uid, gid)
fs.chmod(path, mode, callback)
fs.chmodSync(path, mode)
fs.fchmod(fd, mode, callback)
fs.fchmodSync(fd, mode)
fs.lchmod(path, mode, callback)
fs.lchmodSync(path, mode)
fs.stat(path, callback)
fs.lstat(path, callback)
fs.fstat(fd, callback)
fs.statSync(path)
fs.lstatSync(path)
fs.fstatSync(fd)
fs.link(srcpath, dstpath, callback)
fs.linkSync(srcpath, dstpath)
fs.symlink(srcpath, dstpath, [type], callback)
fs.symlinkSync(srcpath, dstpath, [type])
fs.readlink(path, callback)
fs.readlinkSync(path)
fs.realpath(path, [cache], callback)
fs.realpathSync(path, [cache])
fs.unlink(path, callback)
fs.unlinkSync(path)
fs.rmdir(path, callback)
fs.rmdirSync(path)
fs.mkdir(path, [mode], callback)
fs.mkdirSync(path, [mode])
fs.readdir(path, callback)
fs.readdirSync(path)
fs.close(fd, callback)
fs.closeSync(fd)
fs.openSync(path, flags, [mode])
fs.utimes(path, atime, mtime, callback)
fs.utimesSync(path, atime, mtime)
fs.futimes(fd, atime, mtime, callback)
fs.futimesSync(fd, atime, mtime)
fs.fsync(fd, callback)
fs.fsyncSync(fd)
fs.write(fd, buffer, offset, length, position, callback)
fs.writeSync(fd, buffer, offset, length, position)
fs.read(fd, buffer, offset, length, position, callback)
fs.readSync(fd, buffer, offset, length, position)
fs.readFile(filename, [options], callback)
fs.readFileSync(filename, [options])
fs.writeFile(filename, data, [options], callback)
fs.writeFileSync(filename, data, [options])
fs.appendFile(filename, data, [options], callback)
fs.appendFileSync(filename, data, [options])
fs.watchFile(filename, [options], listener)
fs.unwatchFile(filename, [listener])
fs.watch(filename, [options], [listener])
Caveats
Availability
Filename Argument
fs.exists(path, callback)
fs.existsSync(path)
Class: fs.Stats
fs.createReadStream(path, [options])
Class: fs.ReadStream
Event: 'open'
fs.createWriteStream(path, [options])
Class: fs.WriteStream
Event: 'open'
file.bytesWritten
Class: fs.FSWatcher
watcher.close()
Event: 'change'
Event: 'error'
*/

// variables
var filename = './test.txt'
filename2 = './test2.txt'

console.log('creating...')
fs.writeFileSync(filename, 'Created')

console.log('watching...')
// fs.watchFile(filename, [options], listener)
// { persistent: true, interval: 0 }
// interval ms
// listener gets two arguments the current stat object and the previous stat object
// gets two on update
// gets one on rename
// uses stat polling, slower and less reliable compared to fs.watch
//fs.watchFile(filename, { interval: 1000 }, function (curr, prev) {
//	console.log('fs.watchFile'/*, curr, prev*/)
//})

// fs.watch(filename, [options], listener)
// { persistent: true }
// (event, filename)
// event is either 'rename' or 'change'
// filename is the name of the file which triggered the event
// gets 2 on update
// gets 3 on delete
// prevents program from exit
var watcher = fs.watch(filename, function (event, filename) {
	console.log('fs.watch'/*, event, filename*/)
})

var time = 0
var between = 1000
Array(updateFile, renameFile, deleteFile, done).forEach(function(func) {
	time += between
	setTimeout(func, time)
})
console.log('mainScriptDone')

// update file
function updateFile() {
	console.log('updating...')
	fs.writeFile(filename, 'Updated', function (err) {
		if (err) console.log('failed:', err)
		else console.log('update ok')
	})
}

// rename file
function renameFile() {
	console.log('renaming...')
	fs.rename(filename, filename2, function () {
		console.log('renaimng ok?', arguments)
	})
}

// deleting
function deleteFile() {
	console.log('deleting...')
	fs.unlink(filename2, function () {
		console.log('deleting ok?', arguments)
	})
}

function done() {
	console.log('unwatch')
// associated with watchFile
//	fs.unwatchFile(filename)
	watcher.close()
	console.log('endofProgram')
}

/*
1.      fs.open(path, flags, [mode], callback)
  1.1   path: string absolute filename
  1.2   flags: string eg. 'r'
  1.3   mode: optional integer, default 0666: -rw-r--r--. Used at file creation
  1.4   callback(err, fd): optional function, fd: integer file descriptor.
  1.5   Callback is required to get the file descriptor
  1.6   null can be used to indicate an unopened file descriptor
  1.7   File not found Error has .code 'ENOENT', .path and .errno: 34
*/
p('fs.open(path, flags, [mode], callback)', true)
p('path: string absolute filename')
p('flags: string eg. \'r\'')
p('mode: optional integer, default 0666: -rw-r--r--. Used at file creation')
p('callback(err, fd): optional function, fd: integer file descriptor.')
p('Callback is required to get the file descriptor')
p('null can be used to indicate an unopened file descriptor')
p('File not found Error has .code \'ENOENT\', .path and .errno: 34')

/*
File not found exception

fs:190:fsResult object:Error {
  errno: 34,
  code: 'ENOENT',
  path: 'xdata',
  (nonE)(get)stack: Error: ENOENT, open 'xdata',
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'ENOENT, open \'xdata\'',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}
*/
//fsOpenNoent()
function fsOpenNoent() {
	fs.open('xdata', 'r', fsResult)

	function fsResult(err, fd) {
		require('haraldutil').pp(err)
	}
}

/*
File desciptor value

fs:185:fsResult null, 12
*/
//fsOpen()
function fsOpen() {
	fs.open(filename, 'r', fsResult)

	function fsResult(err, fd) {
require('haraldutil').pargs(arguments)
		if (err) throw err
	}
}

/*
path must be absolute

fs:238:fsResult object:Error {
  errno: 34,
  code: 'ENOENT',
  path: './data/text.txt',
  (nonE)(get)stack: Error: ENOENT, open './data/text.txt',
  (nonE)arguments: undefined,
  (nonE)type: undefined,
  (nonE)message: 'ENOENT, open \'./data/text.txt\'',
  -- prototype: Error,
  (nonE)name: 'Error',
  (nonE)message: '',
  (nonE)toString: function toString()
}
*/
fsOpenRelative()
function fsOpenRelative() {
	fs.open('./data/text.txt', 'r', fsResult)

	function fsResult(err, fd) {
		require('haraldutil').pp(err)
	}
}
