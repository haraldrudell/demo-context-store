// extname.js

// http://nodejs.org/api/path.html
var path = require('path')

var marker ='2012'

var logFilename = 'app.log'

var extLength = path.extname(logFilename).length
require('haraldutil').p(logFilename, 'extLength', extLength, path.extname(logFilename))
if (extLength) extLength++ // period, too
var xx = logFilename.slice(0, -extLength) + '_' + marker + logFilename.slice(-extLength)
require('haraldutil').p(xx)

