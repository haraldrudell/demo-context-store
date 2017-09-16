// test-logscan.js

exports.testGetLines = testGetLines

var folder = '/x/tostorage/120812-logwork'

// http://nodejs.org/api/path.html
var path = require('path')

function testGetLines(test) {
	testGetLineStream(path.join(__dirname, 'data'), function (err, line) {
		if (!err) {
			console.log('line:', line)
		} else console.log(err)
	})
}