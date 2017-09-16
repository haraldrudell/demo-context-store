// functionpointers.js
/*
var in1 = outer()
var in2 = outer()

in1.x = 'in1x'
console.log('in2.x', in2.x)
in2.x = 'in2x'
console.log('in1.x', in1.x)
console.log('boh', in1(), in2())

function outer() {
	return inner
	function inner(x) {
		return b()
	}
	function b() {
		return inner.x
	}
}
*/

console.log('can an inner function have different properties per instance?')
var a = 'A'
var b = 'B'
var f1 = f(a)
var f2 = f(b)
// A B false
console.log('The returned function values are different objects referring to the same code', f1.x, f2.x, f1 == f2)

function f(addProperty) {
	var result = innerFn
	result.x = addProperty
	return result

	function innerFn() {}
}

/*
inside the outer function we want:
input, output, error, complete functions available
*/

// build the flow descriptor
// key: step identifier, value: step's input function
var flow = {
	proc1: getProcessor(),
	proc2: getProcessor(),
}

// store step configuration
// as properties of the input function reference
for (var id in flow) {
	var func = flow[id]
	func.id = id
	func.error = reportError
	func.complete = reportComplete
}

// connect steps of the flow
flow.proc1.output = flow.proc2
flow.proc2.output = collector

// start flow
flow.proc1({text: 'a'})
flow.proc1()

// a simple process step
function getProcessor() {
	return processor
	function processor(data) {
		if (data) {
			data.text += processor.id
			processor.output(data)
		} else {
			processor.complete(processor.id)
			processor.output()
		}
	}
}

function reportError() {
	console.log(arguments.callee.name)
}

function reportComplete(id) {
	console.log(id, 'completed.')
}

function collector(data) {
	if (data) console.log(arguments.callee.name, 'data', data)
	else programEnd()
}

function programEnd() {
	console.log(arguments.callee.name)
}