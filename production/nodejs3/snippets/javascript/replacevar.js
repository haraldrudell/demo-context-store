// replacevar.js

var f = initialF
var throwException = true

var emitter = {}
emitter.id = 'API-ID'
exports.initApi = initApi

console.log('1. when apprunner does not exist')
console.log('f before:', f.name)
try{f = f(exports, emitter)}catch(e){console.log('exception:' + e.message)}
console.log('f after:', f.name)

console.log('2. when apprunner does exist')
throwException = false
console.log('f before:', f.name)
try{f = f(exports, emitter)}catch(e){console.log('exception:' + e.message)}
console.log('f after:', f.name)

function newF() {
	console.log(arguments.callee.name)
}
function initialF(x, e) {
	if (throwException) throw new Error('require: no apprunner for you')
	console.log('Found values:', x && x.initApi && x.initApi.name, e && e.id)
	return newF
}
function initApi() {}