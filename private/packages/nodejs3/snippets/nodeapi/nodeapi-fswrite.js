// nodeapi-fswrite.js

var fs = require('fs')

var file = 'x.txt'
var buf = Buffer('abc')

console.log('buf', buf, buf.length)

var fd = fs.openSync(file, 'w')
var f2 = fs.openSync('y.txt', 'w')
console.log(fd, f2)
fs.writeSync(fd, buf, 0, buf.length)
fs.writeSync(fd, buf, 0, buf.length)
fs.writeSync(fd, buf, 0, buf.length)
fs.closeSync(fd)

var x = fs.readFileSync(file, 'utf-8')
console.log(x == 'abc')
console.log(typeof x, x, x.length)

fs.unlinkSync