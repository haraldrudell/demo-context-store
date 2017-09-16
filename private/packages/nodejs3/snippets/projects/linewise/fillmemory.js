
var linewise = require('./lib/linewise')
var fs = require('fs')

var file= '/x/movies/all/Waiting for Superman (2010)/haideaf-wfs.bozx.mkv'

var inStream = fs.createReadStream(file, {charset:'utf-8'})
var parsedStream = linewise.getPerLineBuffer({noPause:true})
parsedStream.on('data', line)
parsedStream.on('end', end)
parsedStream.on('error', error)
inStream.pipe(parsedStream)
parsedStream.resume()
parsedStream.pause()
setTimeout(f, 5000)

function f() {
	console.log('f')
}

function line(text) {
    //console.log(text)
}

function end() {
    console.log('End of file.')
}

function error(err) {
    throw Error(err)
}