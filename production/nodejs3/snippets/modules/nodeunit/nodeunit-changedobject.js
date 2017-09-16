// nodeunit-changedobject.js


module.exports.f = function (test) {

	var object1 = {
		property: 'object1'
	}
	var object2 = {
		property: 'object2'
	}

	test.deepEqual(object1, object2)
	object1.property = 'overwite'

	console.log('Expected printout: AssertionError: { property: \'object1\' } deepEqual { property: \'object2\' }')
	test.done()
}