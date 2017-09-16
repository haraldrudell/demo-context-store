// tests.js

var path = require('path')

var mocha = new (require('mocha'))({
	ui: 'exports',
	reporter: 'spec',
})
mocha.addFile(path.join(__dirname, 'test', 'test-baseline'))
mocha.addFile(path.join(__dirname, 'test', 'test-calculate'))
mocha.run(end)

function end(failures) {
	process.exit(failures)
}
