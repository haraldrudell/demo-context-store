// clientrequesttimeout.js
// Is there a timeout when doing get?
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com)  All rights reserved.

/*
The node.js http server has a 120 s default timeout after which the socket is closed
clientRequest then emits 'error' socket hang up
*/

var jsutil = require('../../javascript/jsutil')
// http://nodejs.org/api/http.html
var http = require('http')

var p = jsutil.p
var pEval = jsutil.pEval
var log = console.log

jsutil.pFileHeader()

/*
1.      A request that hangs is terminated after 120 s
requested at 2013-04-11T01:06:41.363Z
serverSocketCloseListener 120.099 [ false ]
clientErrorListener 120.1 Error: socket hang up
    at createHangUpError (http.js:1360:15)
    at Socket.socketOnEnd [as onend] (http.js:1457:23)
    at TCP.onread (net.js:419:26)
startShutdown 120.101 shutdown in 10 s
clientSocketCloseListener 120.101 undefined
closeServer 130.102
serverCloseListener 130.103
f*/
p('A request that hangs is terminated after 120 s', true)


var httpServer = new http.Server()
	.on('error', serverErrorListener)
	.once('listening', listeningListener)
	.on('connection', connectionListener)
	.once('close', serverCloseListener)
var start

// .timeout is not defined
httpServer.setTimeout(3e3)
log('httpServer.timeout', typeof httpServer.timeout)
log('httpServer.setTimeout', typeof httpServer.setTimeout)

httpServer.listen()

function serverErrorListener(err) {
	log(arguments.callee.name, getTime(), err.stack)
	startShutdown()
}

function connectionListener(socket) {
	socket.on('error', serverSocketErrorListener)
	socket.once('close', serverSocketCloseListener)
}

function serverSocketErrorListener(err) {
	log(arguments.callee.name, getTime(), err.stack)
}

function serverSocketCloseListener(exceptionFlag) {
	log(arguments.callee.name, getTime(), 'exception:', exceptionFlag)
}

function listeningListener() {
	var url = 'http://localhost:' + httpServer.address().port
log('httpServer.timeout', typeof httpServer.timeout)
log('httpServer.setTimeout', typeof httpServer.setTimeout)

	start = Date.now()
	var clientRequest = http.get(url)
		.on('error', clientErrorListener)
		.once('socket', socketListener)
		.once('response', responseListener)
	log('requested at', new Date(start).toISOString())
}

function clientErrorListener(err) {
	log(arguments.callee.name, getTime(), err.stack)
	startShutdown()
}

function socketListener(socket) {
	socket.on('error', clientSocketErrorListener)
	socket.once('close', clientSocketCloseListener)
}

function clientSocketErrorListener(err) {
	log(arguments.callee.name, getTime(), err.stack)
}

function clientSocketCloseListener(err) {
	log(arguments.callee.name, getTime(), err.stack)
}

function responseListener(response) {
	log(arguments.callee.name, getTime(), response.statusCode)
	startShutdown()
}

function getTime() {
	return (Date.now() - start) / 1e3
}

var shutdown
function startShutdown() {
	if (!shutdown) {
		var t = 1e4
		log(arguments.callee.name, getTime(), 'shutdown in', t /1e3, 's')
		shutdown = setTimeout(closeServer, t)
	}
}

function closeServer() {
	log(arguments.callee.name, getTime())
	httpServer.close()
}

function serverCloseListener() {
	log(arguments.callee.name, getTime())
}
