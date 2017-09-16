// callbacker.js

var gc = getCounter({emit: console.log})

var f1 = function f() {}
var f2 = function f() {}

gc.add(f1)
gc.add(f1)
gc.add(f2)
gc.add(function collector(a) {})
gc.add(function collector() {})

setTimeout(gc.add(collector), 100)
setTimeout(gc.add(collector), 50)

console.log('State:', gc.getState())

function collector() {
	if (gc.isAll(arguments.callee)) console.log('done!')
}

function getCounter(emitter) {
	var functionList = []
	var countList = []

	return {
		add: add,
		isAll: isAll,
		getState: getState,
	}
	function add(f) {
		var index = functionList.indexOf(f)
		if (!~index) {
			countList[functionList.length] = 1
			functionList.push(f)
		} else countList[index]++

		return f
	}
	function isAll(f) {
		var result
		var index = functionList.indexOf(f)
		if (!~index) {
			if (emitter) emitter.emit('error', Error('Unknown function: ' + haraldutil.inspect(f)))
			result = true
		} else {
			result = --countList[index] <= 0
			if (countList[index] < 0 && emitter) emitter.emit('error', Error('Too many isAll incovations: ' + (-countList[index]) + ' ' + haraldutil.inspect(f)))
		}

		return result
	}
	function getState() {
		var result = {}
		functionList.forEach(function (f, index) {
			var fText = getFunctionDescription(f)
			var subIndex = 1
			while (result[fText]) {
				var ft = fText + ' #' + ++subIndex
				if (!result[ft]) {
					fText = ft
					break
				}
			}
			result[fText] = countList[index]
		})
		return result
	}
	function getFunctionDescription(f) {
		var result
		if (typeof f == 'function') {
			var text = f.toString()
			if (text.substring(0, 9) == 'function ') {
				var index = text.indexOf(') {')
				if (index > 12) result = text.substring(9, index + 1)
			}
			if (!result) {
				result = f.name || 'anonymous'
			}
		}
		if (!result) result = haraldutil.inspect(f)

		return result
	}
}

/*
console.log(collector.toString())
console.log((function () {}).toString())

var a = {}
a[collector] = 1
console.log(require('haraldutil').inspectDeep(a))
*/