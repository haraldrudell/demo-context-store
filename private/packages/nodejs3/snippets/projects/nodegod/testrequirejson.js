// testrequirejson.js

// http://nodejs.org/api/path.html
var path = require('path')

var a = require(path.join(__dirname, '../../../package.json'))
console.log(a)