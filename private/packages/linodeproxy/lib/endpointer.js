// endpointer.js
// Get the socket's endpoint for request or response object
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

exports.getAddress = getAddress
exports.getInfo = getInfo

/*
reqRes: request or response object
.useHeaders: boolean default true: use proxy headers

return value: object
.ip: string: ipv4, default '0.0.0.0'
.port: number, default 0
.protocol: string protocol, default 'http'
*/
function getAddress(reqRes, useHeaders) {
	var result = new EndPointer

	if (useHeaders != null ? !!useHeaders : true) getHeaders()
	if (!result.ip || !result.port || !result.protocol) { // use server socket information
		var socket = reqRes && reqRes.connection && reqRes.connection.socket ||
			reqRes && reqRes.socket
		if (!result.ip || !result.port) {
			result.ip = socket && socket.remoteAddress || '0.0.0.0'
			result.port = socket && socket.remotePort || 0
		}
		if (!result.protocol) result.protocol = socket && socket.server && socket.server.constructor &&
			socket.server.constructor.name === 'HTTPSServer' && 'https' || 'http'
	}

	return result

	function getHeaders() {
		var headers = reqRes && reqRes.headers
		if (headers) {
			result.ip = headers['x-forwarded-for']
			result.port = headers['x-forwarded-port']
			result.protocol = headers['x-forwarded-proto']
		}
	}
}

/*
return value: object
.ip: string: ipv4, default '0.0.0.0'
.port: number, default 0
.protocol: string protocol, default 'http'
.url: optional string eg '/uri?queryparameter=value'
.method: optional string: 'GET'
.host: optional string: 'localhost:1080'
*/
function getInfo(reqRes, useHeaders) {
	var result = getAddress(reqRes, useHeaders)

	if (reqRes.url) result.url = reqRes.url
	if (reqRes.method) result.method = reqRes.method
	if (reqRes.headers && reqRes.headers.host) result.host = reqRes.headers.host

	return result
}

function EndPointer() {
}
//EndPointer.prototype.toString = toString
Object.defineProperty(EndPointer.prototype, 'toString', {enumerable: false, value: toString})
function toString() {
	var result = []
	for (var p in this) result.push(p + ':', this[p])
	return result.join(' ')
}
