// mocha-fail.js
/*
invoke like:
mocha --ui exports mocha-fail.js

DOES NOT ECHO MISISNG NEWLINE
- there are many otehr situations when this happens

EXPECTED: "scripts":<newline>   {
- in the printout
*/
exports.f = function () {
	var fourSpaces = '   '
	require('assert').equal(
		'"scripts":' + fourSpaces + '{\n}\n}',
		'"scripts":\n' + fourSpaces + '{\n}\n}'
		)
}
/*
issue: output is:
  ․

  ✖ 1 of 1 test failed:

  1)  f:
      
      actual expected
      
      "scripts":
          {
      }
      }
*/