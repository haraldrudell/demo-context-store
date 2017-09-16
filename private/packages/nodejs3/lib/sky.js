// sky.js
// nodejs3 backend with facebook authentication
// © Harald Rudell 2012 MIT License

var crypto = require('crypto')

exports.request = request
exports.setSecret = setSecret

var secret

function request(socket, data) {
	console.log('data:', data)
	if (data.auth) {
		// auth: userID, expiresIn signedRequest, accessToken
		var obj = verifyRequest(data.auth.signedRequest)
		result = obj && obj.user_id == '775861653'
		// it is authentication
		socket.emit('skyout', {result: result})
	}
}

function setSecret(sec) {
	secret = sec
}

function verifyRequest(signedRequest) {
	var result = false

	do {
		// parse into hash and payload
		var str = signedRequest && signedRequest.valueOf()
		if (typeof str != 'string') break
		var hashAndPayload = signedRequest.split('.')
		if (hashAndPayload.length != 2) break

		// get payload and verify algorithm
		var payload = getPayloadObject(hashAndPayload[1])
		if (typeof payload != 'object' ||
			payload.algorithm != 'HMAC-SHA256') break

		// verify hash
		var myHash = createHash(hashAndPayload[1], secret)
		if (myHash != hashAndPayload[0]) break

		// return payload fields
		delete payload.algorithm
		delete payload.code
		result = payload

	} while (false)

	return result

}

// return value object, undefined on troubles
function getPayloadObject(str) {
	var obj

	var jsonString = decode(str)

	if (str.length) {
		try {
			obj = JSON.parse(jsonString)
		} catch (e) {
		}
	}

	return obj
}

// calculate hash part
function createHash(payload, secret) {
	var result

	if (typeof secret == 'string') {
		var shasum = crypto.createHmac('sha256', secret)
		shasum.update(payload)
		result = shasum.digest('base64')
			.replace(/\+/g,'-')
			.replace(/\//g,'_')
			.replace(/=/g,'')
	}
	return result
}

// decode Facebook's version of base64
// return value: string, 0-length on troubles
function decode(str) {
	// make real base64 with 1 or 2 end padding equal signs
	str = str.replace('/-/g', '+').replace('/_/g', '/')
	while(str.length % 4) str += '='

	return new Buffer(str, 'base64').toString('utf-8')
}

// encode Facebook's version of base64
function encode(str) {
	console.log('str', typeof str, str.length)
	return new Buffer(str, 'utf-8')
		.toString('base64')
		.replace(/\+/g,'-')
		.replace(/\//g,'_')
		.replace(/=/g,'')
}
