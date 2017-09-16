// cloudservice.js

/*
120801 this was my own implementation of
authentication of site bisitors using Facebook
identity, executed server server side

Since, I moved to everyauth
*/

// imports
// http://nodejs.org/api/path.html
var path = require('path')
var crypto = require('crypto')
var store = require('./store')

module.exports = {
	authenticate: authenticate,
	provision: provision,
}
var fbIds
var secret
var myStore

function provision(defaults) {
	fbIds = defaults.fbIds
	secret = defaults.fbAppSecret
	myStore = store.get(path.join(
		defaults.init.tmpFolder,
		defaults.init.identifier + 'store.json'))
}

// return value:
// === true: success
// otherwise string fault
function authenticate(data) {
	var result

	// attempt to authenticate
	do {

		// is server provisioned to authenticate?
		if (!data || !data.auth || !data.auth.signedRequest ||
			!Array.isArray(fbIds)) {
			result = 'Server not ready'
			break
		}

		// verify the signed request
		// auth: userID, expiresIn signedRequest, accessToken
		var obj = verifyRequest(data.auth.signedRequest, storeObject)
		if (!obj) {
			result = 'Bad credentials'
			break
		}

		// save verified credentials
		var storeObject = {
			expiresIn: data.auth.expiresIn,
			accessToken: data.auth.accessToken,
			userId: obj.user_id,
			issuedAt: obj.issued_at,
		}
		myStore[obj.user_id] = storeObject
		myStore.save()

		// verify user ids is in the white list
		if (fbIds.indexOf(obj.user_id) == -1) {
			result = 'Not whitelisted'
			break
		}

		// success!
		result = true
	} while (false)

	return result
}

function setSecret(sec) {
	secret = sec
}

// return value:
// false on failure
// { issued_at: number timestamp, user_id: numeric string }
function verifyRequest(signedRequest, storeObject) {
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
