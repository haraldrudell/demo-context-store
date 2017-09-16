// fsjournal.js
// Save data to the filesystem
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

/*
Store journal entries by date in the file system
Reports anomalies
*/

// https://github.com/haraldrudell/apprunner
var apprunner = require('apprunner')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

exports.writeEntry = writeEntry

var privs = 0770

/*
Write a file to a file system storage hierarchy
opts: object
.baseFolder: string absolute path to folder
.filename: string filename with extension
.data: what to write
cb(err): function
*/
function writeEntry(opts, cb) {
	var invocation = new Error(arguments.callee.name)
	var date = new Date().toISOString()
	var dateFolder = path.join(opts.baseFolder, date.substring(0, 4) + date.substring(5, 7)) // '201212'
	var filename = path.join(dateFolder, opts.filename)

	fs.exists(dateFolder, existsResult)

	function existsResult(exists) {
		if (!exists) fs.mkdir(dateFolder, privs, mkdirResult)
		else mkdirResult()
	}

	function mkdirResult(err) {
		if (!err) {
			if (!opts.readOnly) fs.writeFile(filename, opts.data, writeFileResult)
			else writeFileResult()
		} else {
			err[invocation.message] = {
				invocation: invocation,
				path: dateFolder,
			}
			apprunner.anomaly(err)
			cb(err)
		}
	}

	function writeFileResult(err) {
		if (err) {
			err[invocation.message] = {
				invocation: invocation,
				path: filename,
			}
			apprunner.anomaly(err)
		}
		cb(err)
	}
}
