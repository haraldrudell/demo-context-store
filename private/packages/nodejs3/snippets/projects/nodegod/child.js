// child.js

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var fileId = __filename.substring(__filename.lastIndexOf('/') + 1)

console.log(fileId, process.pid)
process.on('message', processMessage)

console.log(fileId, typeof process.send == 'function' ? 'ipc is enabled' : 'no ipc')
delayExit(5e3)

function processMessage() {
	console.log(fileId, arguments.callee.name,
		haraldutil.inspect(Array.prototype.slice.call(arguments)))
	console.log(typeof process.send)
	process.send('def')
}

function delayExit(t) {
	if (isNaN(t) || t < 1e3) t = 3e3
	console.log(fileId, 'exiting in ' + (t / 1e3) + ' s')
	setTimeout(f, t)

	function f() {
		console.log(fileId, 'exiting')
	}
}
/*
default 18 files are opened
$ lsof -p 3795
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF    NODE NAME
node    3795 foxyboy  cwd    DIR   8,97     4096 2351302 /home/foxyboy/Desktop/c505/node/nodejs3
node    3795 foxyboy  rtd    DIR    8,2     4096       2 /
node    3795 foxyboy  txt    REG    8,2 10348455  468989 /usr/local/bin/node
node    3795 foxyboy  mem    REG    8,2  1802936 2048011 /lib/x86_64-linux-gnu/libc-2.15.so
node    3795 foxyboy  mem    REG    8,2   135366 2048136 /lib/x86_64-linux-gnu/libpthread-2.15.so
node    3795 foxyboy  mem    REG    8,2    88384 2048173 /lib/x86_64-linux-gnu/libgcc_s.so.1
node    3795 foxyboy  mem    REG    8,2  1030512 2054430 /lib/x86_64-linux-gnu/libm-2.15.so
node    3795 foxyboy  mem    REG    8,2   962656  394712 /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.16
node    3795 foxyboy  mem    REG    8,2    14768 2048010 /lib/x86_64-linux-gnu/libdl-2.15.so
node    3795 foxyboy  mem    REG    8,2    31752 2054423 /lib/x86_64-linux-gnu/librt-2.15.so
node    3795 foxyboy  mem    REG    8,2   149280 2054436 /lib/x86_64-linux-gnu/ld-2.15.so
node    3795 foxyboy    0u   CHR 136,10      0t0      13 /dev/pts/10
node    3795 foxyboy    1u   CHR 136,10      0t0      13 /dev/pts/10
node    3795 foxyboy    2u   CHR 136,10      0t0      13 /dev/pts/10
node    3795 foxyboy    3u  0000    0,9        0    6797 anon_inode
node    3795 foxyboy    4u  0000    0,9        0    6797 anon_inode
node    3795 foxyboy    5r  FIFO    0,8      0t0 4525006 pipe
node    3795 foxyboy    6w  FIFO    0,8      0t0 4525006 pipe
*/