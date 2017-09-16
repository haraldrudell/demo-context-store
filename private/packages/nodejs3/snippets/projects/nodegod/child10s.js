// child10s.js

setTimeout(f, 1e4)
function f() {
	console.log('child:', process.pid, 'exiting')
}