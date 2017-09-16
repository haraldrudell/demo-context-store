// nodeapi-http-exception.js

// on exceptions, node print them with a stack trace
/*
(newline)
node.js:201
				throw e; // process.nextTick error, or 'error' event on first tick
							^
Error: failure
		at Error (unknown source)
		at Object.<anonymous> (/home/foxyboy/Desktop/c505/node/nodejs3/snippets/nodeapi/nodeapi-http-exception.js:4:7)
		at Module._compile (module.js:441:26)
		at Object..js (module.js:459:10)
		at Module.load (module.js:348:31)
		at Function._load (module.js:308:12)
		at Array.0 (module.js:479:10)
		at EventEmitter._tickCallback (node.js:192:40)
*/
//throw Error('failure')
var http = require('http')

// http is a special case, where requests are not originated from your program
// how do you capture exceptions in request handler code?
//http://nodejs.org/docs/latest/api/http.html
var port = 3000
var server = http.createServer().listen(port)

// array
// either function
// or an array of function + arguments
var go = [ fetch1, [ getHttp, 5 ] ]

go.next = next
go.exit = exit

function next(arg) {
	var argArray = this.shift()
	var nextFunc
	if (argArray instanceof Function) {
		nextFunc = argArray
		argArray = undefined 
	} else {
		nextFunc = argArray.shift()
	}
	nextFunc.apply(null, argArray)
}
function exit() {

}

// fetch google
function fetch1(go) {
	var rq = http.request({}, function (r) {
		responseLogger(r)
		go.next()
	})
	rq.on('error', errorLogger)
	rq.end()
}

// fetch from out http
function getHttp() {

	var httpClientRequest = http.request({
		//host: 'localhost',
		// hostname...
		port: port,
		// socketPath...
		method: 'HEAD',
		// path: '/',
		//headers: ...
		//auth:...
		//agent...
	}, function (r) {
		responseLogger(r)
		shutdownServer()
	})
	httpClientRequest.on('error', errorLogger)

	// write data to request body
	//httpClientRequest.write('data\n')
	//httpClientRequest.write('data\n')
	httpClientRequest.end('data')
}

function shutdownServer() {
	http.close()
}

function responseLogger(response) {
	console.log('STATUS:' + response.statusCode)
	console.log('HEADERS:' + JSON.stringify(response.headers))
	response.setEncoding('utf8')
	response.on('data', function (chunk) {
		console.log('BODY: ' + chunk)
	})
}

function errorLogger(e) {
	console.log('problem with request: ' + e instanceof Error ? e.message : e)
	if (e instanceof Error) console.log(e.stack)
}
