// requiredfile.js

console.log('executing file.js', (new Error()).stack)
exports.a = a

function a() {
	console.log('executing a')
}