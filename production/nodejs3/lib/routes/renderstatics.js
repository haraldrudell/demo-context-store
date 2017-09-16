// renderstatics.js
// renders a static file from the filesystem

// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

exports.getHandler = getHandler

function getHandler(settings) {

	// render a file as static html
	return function renderStatic(request, response) {
		console.log(arguments.callee.name)
		var data
		if (request.method != 'HEAD') {
			var file = path.join(settings.folder, request.route.path.substring(1))
			try {
				var data = fs.readFileSync(file)
			} catch(e) {
				data = 'no data'
			}
		}
		response.writeHead(200, {'content': 'text/html'})
		response.end(data)
	}

}