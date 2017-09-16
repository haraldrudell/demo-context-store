// stdinchild.js

var pe = process.emit
process.emit = function () {
	var args = Array.prototype.slice.call(arguments)
	require('haraldutil').q('process', args)
	pe.apply(process, args)
}

var se = process.stdin.emit
process.stdin.emit = function () {
	var args = Array.prototype.slice.call(arguments)
	require('haraldutil').q('stdin', args)
	se.apply(process.stdin, args)
}

process.stdin.on('data', echoData)
process.stdin.setEncoding('utf-8')
process.stdin.resume()
//process.stdin.destroy()
process.send({a: 1}/*new Error('ok')*/)
console.log('child ready')

//process.stdin.on('error', function () {})

function echoData(data) {
	console.log(arguments.callee.name, data)
	//process.stdin.emit('error', new Error('bad'))
}