// timeoutclosure.js

f()
function f() {
	key = '5'
	setTimeout(g, 100)
	return
	function g() {
		console.log(key)
	}
}