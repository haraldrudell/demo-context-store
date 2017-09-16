var exports
(function moduleFile() {
	// this is the beginning of our module file
	var classVariable = 17

	// We need a way to create multiple instances
	// here we declare a factory function that returns a new instance
	// the closure created here contaibs classVariable
	exports = factory
	function factory(id) {
		// this variable is declared every time a new object is requested
		var instanceVariable = id
		factory.publicClassVariable = 4

		// this function represents the instance
		// it is defined every time factory is invoked
		// declaring it creates a closure of instance variables
		function instance() {
			return instanceVariable
		}
		instance.setInstanceVariable = setInstanceVariable
		instance.setClassVariable = setClassVariable
		instance.getClassVariable = getClassVariable
		instance.addToPublicClassVariable = addToPublicClassVariable
		instance.publicInstanceVariable = id + 10
		instance.getPublicInstanceVariable = getPublicInstanceVariable
		return instance

		function setInstanceVariable(number) {
			instanceVariable = number
		}

		function getPublicInstanceVariable() {
			return instance.publicInstanceVariable
		}

	}

	exports.addToPublicClassVariable = addToPublicClassVariable
	function addToPublicClassVariable(number) {
		return factory.publicClassVariable += number
	}

	function setClassVariable(number) {
		classVariable = number
	}

	function getClassVariable() {
		return classVariable
	}
})()
// this is our require statement
var module = exports

// function factory(id)...
//console.log('module:', module)

var a = module(1)
// function instance()...
//console.log('a:', a)

var b = module(2)
// function instance()...
//console.log('b:', b)

// 17
console.log('a initial class variable', a.getClassVariable())
a.setClassVariable(5)
// 5
console.log('a updated class variable', a.getClassVariable())
// 5
console.log('b class variable also updates', b.getClassVariable())

// a 1
console.log('a instance value', a())
// b 2
console.log('b instance value', b())

a.setInstanceVariable(3)
// a 3
console.log('a updated instance value', a())
// b 2
console.log('b instance value not updated', b())

console.log('public class', module.publicClassVariable)
console.log('first add to public class variable:', module.addToPublicClassVariable(2))
console.log('second add to public class variable:', a.addToPublicClassVariable(2))

console.log('a public instance variable', a.getPublicInstanceVariable())
console.log('b public instance variable', b.getPublicInstanceVariable())
a.publicInstanceVariable += 2
console.log('a updated public instance variable', a.getPublicInstanceVariable())
console.log('b unchanged public instance variable', b.getPublicInstanceVariable())
