// functionscope.js

var module = {}
moduleCode(module)
module.f2()
module.f1()

function moduleCode(exports) {
	var a = 5
	exports.f1 = f1
	exports.f2 = f2
	function f1() {
		console.log(arguments.callee.name, a)
	}
	function f2() {
		console.log(arguments.callee.name, a)
		a = 3
		console.log(arguments.callee.name, a)
	}
}