// nodeapi-fswatch.js

// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

var file = path.join(__dirname, 'data', 'text.txt')

var w1 = fs.watch(file, watchFunc1)
var w2 = fs.watch(file, watchFunc2)

fs.writeFileSync(file, 'text')
setTimeout(f, 200)

function watchFunc1() {
	console.log(arguments.callee.name)
}
function watchFunc2() {
	console.log(arguments.callee.name)
}

function f() {
	w1.close()
	w2.close()
}
