// instance variables: unique to one instance
// static variables: unique to one class

// using new
function Constructor() {
	this.instance = 1
}
a = new Constructor()
b = new Constructor()
a.instance++
// 1 2
console.log('Using new:', b.instance, a.instance)

// using closure
function func() {
	var instance = 1
	function closure() {
	}
	closure.increment = function () {
		return ++instance
	}
	closure.get = function get() {
		return instance
	}
	return closure
}
a = func()
b = func()
a.increment()
console.log('Using closure:', b.get(), a.get())

// full class
// singleton is invoked once per node launch
// node.js ensures only the first require statement invokes singleton
// for subsequent require statements, the value from the first invocation is returned
// unless call or apply is used, this is the global object
function singleton() {
	var privateClassVariable = 1
	constructor.publicClassVariable = 10
	function privateClassMethod() {
		return 'privateClassMethod: ' +
			privateClassVariable + ', ' +
			constructor.publicClassVariable
	}
	constructor.publicClassMethod = function publicClassMethod() {
		return 'publicClassMethod: ' + privateClassMethod()
	}
	function constructor() {
		var privateMemberVariable = ++privateClassVariable
		constructor.publicMemberVariable = ++constructor.publicClassVariable
		function instance() {
		}
		function privateInstanceMethod() {
			return 'privateInstanceMethod: ' +
				privateMemberVariable + ', ' +
				constructor.publicMemberVariable + ', ' +
				privateClassVariable + ', ' +
				constructor.publicClassVariable
		}
		instance.publicInstanceMethod = function publicInstanceMethod() {
			return 'publicInstanceMethod: ' + privateInstanceMethod()
		}
		instance.add100 = function add100() {
			privateMemberVariable += 100
			constructor.publicMemberVariable += 100
			privateClassVariable += 100
			constructor.publicClassVariable += 100
		}
		return instance
	}

	return constructor
}

// invoke with this as the singleton object
var module = singleton()
console.log('module state before instantiation: ', module.publicClassMethod())
var instance1 = module()
console.log('module state after 1 instantiation: ', module.publicClassMethod())
var instance2 = module()
console.log('module state after 2 instantiations: ', module.publicClassMethod())
instance1.add100()
console.log('instance 1 state:', instance1.publicInstanceMethod())
console.log('instance 2 state:', instance2.publicInstanceMethod())
console.log('module publics:', Object.keys(module))
console.log('instance1 publics:', Object.keys(instance1))
