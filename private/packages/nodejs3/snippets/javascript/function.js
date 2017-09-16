// function.js

console.log('1. Is an undefined argument counted in the arguments value?')
a('error', undefined)

function a() {
	// 1a. Yes, a second undefined argument exists: { '0': 'error', '1': undefined }
	console.log('1a. Yes, a second undefined argument exists:', arguments)
}

console.log(typeof function () {})
