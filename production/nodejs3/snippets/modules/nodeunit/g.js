// nodeunit-order.js

var assert = require('assert')

module.exports.f = function (test) {

    // check assert
    try {
        assert.equal(1, 2)
    } catch(e) {
        if (e.toString() != 'AssertionError: 1 == 2') throw Error()
    }
    try {
        assert.equal(false, true)
    } catch(e) {
        if (e.toString() != 'AssertionError: false == true') throw Error(e)
    }
    console.log('assert module works as expected')

    console.log('BUG: As of nodeunit 0.7.4, the order of the boolean values is swapped.')
    console.log('The second error should be ' +
        '"AssertionError: false == true"' +
        ' not ' +
        '"AssertionError: true == false"')
    test.equal(1, 2)
    test.equal(false, true)
    test.done()
}