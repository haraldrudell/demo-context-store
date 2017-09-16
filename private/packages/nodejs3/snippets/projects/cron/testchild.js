// testchild.js
// see if we can kill child

var exec = require('child_process').exec

var inspect = require('./inspect')

var child = exec('find / >/dev/null', undefined, function (error, stdout, stderr) {
	//console.log('stdout:', inspect(stdout))
	if (error) {
		console.log('exit code:', error.code,
			'exec returned error:'/*, error*/)
	}
	if (stderr) {
		//console.log('stderr:', stderr, ')')
	}
})
child.on('exit', function(code, signal) {
	console.log('exitt')
})
console.log('child:', child.pid)
//child.kill() // SIGTERM
//child.kill('SIGHUP')
child.kill('SIGKILL')
//var child2 = exec('kill ' + child.pid)
console.log('sighup sent')
