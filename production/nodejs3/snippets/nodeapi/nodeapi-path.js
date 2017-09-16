// nodeapi-path.js
// demonstrate how to use path in the node.js api

// http://nodejs.org/api/path.html
var path = require('path')

// _dirname: /home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi
// fully qualified, any .. and . has been removed
// console.log('__dirname:', __dirname)

// __filename: /home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-http.js
// fully qualified, any .. and . has been removed
//console.log('__filename:', __filename)

//path.basename(p, [ext])
// get the script filename: nodeapi-http
console.log('get the script filename: ',
	path.basename(__filename,
	path.extname(__filename)))

// REFERENCE

// path.resolve([from ...], to)
// makes the last path absolute
// if last argument not already abolute, prepend arguments from right to left
// last attempt prepend cwd
//
// resolve: /home/foxyboy/Desktop/c505/node/nodejs3/file
console.log('resolve:', path.resolve('file'))

// path.dirname(p)
//
// no folder portion: '.'
// dirname: .
console.log('dirname:', path.dirname('file'))
// dirname: /
console.log('dirname:', path.dirname('/file'))

// path.extname(p)
// missing extension: '' (string  length 0)
console.log('ext:',
	typeof path.extname('/file'),
	path.extname('/file'),
	path.extname('/file').length)
// with extsntion a.b: '.b'
console.log('a.b:', path.extname('a.b'))
// there is no function to append extension to a filename

// path.resolve([from ...], to)
// resolve /home/foxyboy/Desktop/c505/node/nodejs3/file.ext
console.log('resolve', path.resolve(undefined, 'file.ext'))

// path.normalize(p)
// expands . and .. of a filename
// normalize: .
console.log('normalize:', path.normalize('.'))
// normalize: /var
console.log('normalize:', path.normalize('/tmp/../var'))

//path.relative(from, to)
// rel: y
console.log('rel:', path.relative('/tmp/x', '/tmp/x/y'))

// path.join([path1], [path2], [...])
//path.exists(p, [callback])
//path.existsSync(p)

// There is no way of removing a terminating slash
// normalize uses separator character '/' literal
