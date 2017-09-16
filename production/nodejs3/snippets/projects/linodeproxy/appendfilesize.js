// appendfilesize.js

// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

var flags = { // options for fs.createWriteStream
	flags: 'a',
	encoding: 'utf-8',
	mode: 0660, // rw- rw- ---
}

var file = path.join(require('haraldutil').getTmpFolder(), 'data.txt')
// appendfilesize:15 filename: /home/foxyboy/tmp/data.txt
require('haraldutil').p('filename:', file)

var s = 'This is a single line of text'
// appendfilesize:19 length 29
require('haraldutil').p('length', s.length)

//fs.writeFileSync(file, s)

var stream = fs.createWriteStream(file, flags)
	.on('open', doStat)

function doStat(fd) {
	// appendfilesize:23:doStat 'stream.fd' 7
	require('haraldutil').pp('stream.fd', fd)
	fs.fstat(fd, check)
}
/*
appendfilesize:28:check {
  atime: Date(1358412389000),
  uid: 1000,
  rdev: 0,
  ino: 3868436,
  dev: 2145,
  blksize: 4096,
  size: 29,
  mtime: Date(1358412389000),
  gid: 1000,
  nlink: 1,
  mode: 33204,
  blocks: 8,
  ctime: Date(1358412389000),
  -- prototype,
  isBlockDevice: function (),
  _checkModeProperty: function (property),
  isFile: function (),
  isSymbolicLink: function (),
  isFIFO: function (),
  isDirectory: function (),
  isCharacterDevice: function (),
  isSocket: function ()
}
*/
function check(err, stat) {
	if (err) throw err
	require('haraldutil').pp(stat)
}
/*
bytes written does not include any existing size
there is no this.pos
// bytesWritten = 0
stream.write('x', func)
function func() {
	require('haraldutil').pp(stream)
}
*/