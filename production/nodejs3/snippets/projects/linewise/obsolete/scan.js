// scan.js

var readfile = require('./lib/linewise')
// http://nodejs.org/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

var folder = '/x/tostorage/120812-logwork'
var expectedLines

var firstLineMarker = 'exception Emask'
var lastLineMarker = 'SError'
var transmissionError = '10B8B'
var phyText = 'PHY RDY changed'
var textResult = []
var lengths = {}
doit()

function doit() {
	var gotEnd
	var lines = 0

	var files = fs.readdirSync(folder)
	var filesIndex = 0

	var parsedStream = readfile.getPerLineBuffer()
	parsedStream.on('data', line)
	parsedStream.on('end', end)

	nextFile()

	function nextFile() {
		var absolute = path.join(folder, files[filesIndex++])
		var lastFile = filesIndex == files.length
		var inStream = fs.createReadStream(absolute, {encoding:'utf-8'})
		if (!lastFile) inStream.on('end', nextFile)
		inStream.pipe(parsedStream, {end:lastFile})
		parsedStream.resume()
	}

	function line(text) {
		lines++
		if (textResult.length) {
			textResult.push(text)
			if (text.indexOf(lastLineMarker) != -1) {
				if (textResult.length > 3) throw Error('Bad Log')
				if (text.indexOf(transmissionError) != -1) {
					lengths['tx'] = (lengths['tx'] || 0) + 1
				} else if (text.indexOf(phyText) != -1) {
					lengths['phy'] = (lengths['phy'] || 0) + 1
				} else {
					lengths['suspect'] = (lengths['suspect'] || 0) + 1
					console.log(textResult)
				}
				textResult = []
			}
		}
		if (text.indexOf(firstLineMarker) != -1) textResult.push(text)
	}

	function end() {
		gotEnd = true
console.log('end of text', lengths, lines)
	}
}
