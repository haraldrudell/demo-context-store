// terminal-child.js
// © Harald Rudell 2013 <harald@therudells.com> All rights reserved.

var childipc = require('./childipc')
var filestream = require('./filestream')
var listenermanager = require('./listenermanager')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/util.html
var util = require('util')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var mockIpc = {write: function () {}}
var mockFile = {writable: false}
var lm
var secondLogger
var file = mockFile
var childIpc = mockIpc

// setup log output and expcetion handling
var marker = path.basename(__filename, path.extname(__filename)) + ':' + process.pid
function log() {
	var s = marker + ' ' + util.format.apply(this, Array.prototype.slice.call(arguments)) + '\n'
	childIpc.write(s)
	if (file.writable) file.write(s)
}
process.on('uncaughtException', processUncaughtExceptionListener)
process.on('SIGINT', processSigIntListener)

// enable file log
file = new filestream.FileStream(path.join(haraldutil.getTmpFolder(), path.basename(__filename, path.extname(__filename)) + '.log'))
lm = new listenermanager.ListenerManager
lm.addListener(file, 'once', 'close', getListener('file close', log))
lm.addListener(file, 'on', 'error', getListener('file error', log))
//throw new Error('bad')
childIpc = new childipc.ChildIpc()
lm.addListener(childIpc, 'once', 'close', getListener('ipc close', log))
lm.addListener(childIpc, 'once', 'error', getListener('ipc error', log))

log('Starting', childIpc.writable ? 'with ipc' : 'no ipc', (new Date).toISOString())
secondLogger = new SecondLogger(log).start()

function SecondLogger(log) {
	self = this
	this.start = start
	this.cancel = cancel
	var seconds = 0
	var timer

	function start() {
		timer = setInterval(f, 1e3)
		return self
	}
	function f() {
		log('Seconds:', ++seconds)
	}
	function cancel() {
		if (timer) {
			var t = timer
			timer = null
			clearTimeout(t)
		}
	}
}

function processUncaughtExceptionListener() {
var e = Array.prototype.slice.call(arguments)[0]
	var logArgs = ['process uncaughtException'].concat(Array.prototype.slice.call(arguments))
	if (e.stack) logArgs.push(e.stack)
	log.apply(this, logArgs)
	shutdown()
}

function processSigIntListener() {
	log('process SIGINT')
	shutdown()
}

function shutdown() {
	if (secondLogger) {
		secondLogger.cancel()
		secondLogger = null
	}
	if (childIpc.destroy) childIpc.destroy(destroyStream)
	else destroyStream()
}

function destroyStream() {
	childIpc = mockIpc
	if (file.end) file.end(marker + ' Closing log at:' + (new Date).toISOString() + '\n', exit)
	else exit()
}

function exit() {
	if (lm) {
		lm.removeListeners()
		lm = null
	}
	file = null
}

function getListener(slogan, log) {
	return listener

	function listener(data) {
		log.apply(this, [slogan].concat(Array.prototype.slice.call(arguments)))
		if (data instanceof Error && data.stack) log(data.stack)
	}
}
