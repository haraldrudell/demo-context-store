console.log(process.version)
var a = [
function () {
	someFunction()
	function someFunction() {
		console.log(new Error('Why is second frame ps? it should be <anonymous>').stack)
	}
},
function () {
	var ps = 5
},
]
f(a[0])
function f(fn) {
	fn()
}