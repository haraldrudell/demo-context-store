// watchers.js

/*
Conclusions
On create of file, folder watcher gets rename and change events
On update of file, folder watcher gets two change events, file watcher gets two change event
On rename of file, folder watcher gets two rename events, file watcher gets one rename event
On delete of file, folder watch gets two change and four rename events, folder watcher gets one rename event
*/
/*
===  watchers 2013-01-23T20:17:27.962Z
watchers:75:execute createFolder
watchers:75:execute removeFiles
watchers:75:execute testWatchers
watchers:82:testWatchers Watching folder
watchers:86:testWatchers Creating file...
watchers:137:folderWatch 'rename' 'testfile.txt'
watchers:137:folderWatch 'change' 'testfile.txt'
watchers:91:writeFileResult Watching file
watchers:99:updateFile Updating file...
watchers:137:folderWatch 'change' 'testfile.txt'
watchers:141:fileWatch 'change' 'testfile.txt'
watchers:137:folderWatch 'change' 'testfile.txt'
watchers:141:fileWatch 'change' 'testfile.txt'
watchers:109:renameFile Renaming file...
watchers:137:folderWatch 'rename' 'testfile.txt'
watchers:137:folderWatch 'rename' 'testfile2.txt'
watchers:141:fileWatch 'rename' 'testfile.txt'
watchers:115:renameResult Watching file2
watchers:123:deleteFile Deleting file...
watchers:141:fileWatch 'change' 'testfile.txt'
watchers:141:fileWatch 'change' 'testfile.txt'
watchers:141:fileWatch 'rename' 'testfile.txt'
watchers:141:fileWatch 'rename' 'testfile.txt'
watchers:141:fileWatch 'rename' 'testfile.txt'
watchers:141:fileWatch 'rename' 'testfile.txt'
watchers:137:folderWatch 'rename' 'testfile2.txt'
watchers:75:execute removeAll
watchers:137:folderWatch 'rename' 'testfolder'
watchers:137:folderWatch 'rename' 'testfolder'
watchers:75:execute unwatch
watchers:222:unwatch unwatching: 3
watchers:75:execute done
watchers:160:end End of program
*/
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/api/fs.html
var fs = require('fs')

var folderName = 'testfolder'
var filename = 'testfile.txt'
var filename2 = 'testfile2.txt'
var timeout = 100

var fqFolder = path.join(__dirname, folderName)
var fqFile = path.join(fqFolder, filename)
var fqFile2 = path.join(fqFolder, filename2)

var a = [
	createFolder,
	removeFiles,
	testWatchers,
	removeAll,
	unwatch,
	done,
]
var unwatchers = []

console.log('\n\n=== ',
	path.basename(__filename, path.extname(__filename)),
	(new Date).toISOString())
execute()

function execute(err) {
	if (!err) {
		var fn = a.shift()
		if (fn) {
			require('haraldutil').p(fn.name)
			fn(execute)
		}
	} else throw err
}

function testWatchers(cb) {
	require('haraldutil').p('Watching folder')
	var folderFsWatcher = fs.watch(fqFolder, folderWatch)
	unwatchers.push(getUnwatcher(folderFsWatcher))

	require('haraldutil').p('Creating file...')
	fs.writeFile(fqFile, 'first', writeFileResult)

	function writeFileResult(err) {
		if (!err) {
			require('haraldutil').p('Watching file')
			var fileFsWatcher = fs.watch(fqFile, fileWatch)
			unwatchers.push(getUnwatcher(fileFsWatcher))
			setTimeout(readFile, timeout)
		} else cb(err)
	}

	function readFile() {
		require('haraldutil').p('Reading file...')
		fs.readFile(fqFile, secondResult)
	}

	function secondResult(err) {
		if (!err) setTimeout(updateFile, timeout)
		else cb(err)
	}


	function updateFile() {
		require('haraldutil').p('Updating file...')
		fs.writeFile(fqFile, secondResult)
	}

	function secondResult(err) {
		if (!err) setTimeout(renameFile, timeout)
		else cb(err)
	}

	function renameFile() {
		require('haraldutil').p('Renaming file...')
		fs.rename(fqFile, fqFile2, renameResult)
	}

	function renameResult(err) {
		if (!err) {
			require('haraldutil').p('Watching file2')
			var fileFsWatcher = fs.watch(fqFile2, fileWatch)
			unwatchers.push(getUnwatcher(fileFsWatcher))
			setTimeout(deleteFile, timeout)
		} else cb(err)
	}

	function deleteFile() {
		require('haraldutil').p('Deleting file2...')
		fs.unlink(fqFile2, unlinkResult)
	}

	function unlinkResult(err) {
		if (!err) setTimeout(end, timeout)
		else cb(err)
	}

	function end() {
		cb()
	}

	function folderWatch(event, filename) {
		require('haraldutil').q(event, filename)
	}

	function fileWatch(event, filename) {
		require('haraldutil').q(event, filename)
	}

	function getUnwatcher(fsWatch) {
		if (!fsWatch) throw new Error(arguments.callee.name +  ' must get fs.Watch object')
		if (!(typeof fsWatch.close === 'function')) throw new Error('fs.Watch does not have close function')
		return unwatch

		function unwatch() {
			fsWatch.close()
		}
	}
}

function done(cb) {
	// allow for last watcher events to fire
	process.nextTick(end)

	function end() {
		require('haraldutil').p('End of program')
		cb()
	}
}

function createFolder(cb) {
	if (haraldutil.getType(fqFolder) !== 1) {
		fs.mkdir(fqFolder, mkdirResult)
	} else cb()

	function mkdirResult(err) {
		if (err) cb(err)
		else cb()
	}
}

function removeFiles(cb) {
	var cbCounter = 1
	var isError

	fs.readdir(fqFolder, readdirResult)

	function readdirResult(err, files) {
		if (!err) {
			files.forEach(function (entry) {
				cbCounter++
				var fqFile = path.join(fqFolder, entry)
				fs.unlink(fqFile, end)
			})
			end()
		} else cb(err)
	}

	function end(err) {
		if (!err) {
			if (!--cbCounter) cb()
		} else if (!isError) {
			isError = true
			cb(err)
		}
	}
}

function removeAll(cb) {
	removeFiles(removeFolder)

	function removeFolder(err) {
		if (!err) {
			fs.rmdir(fqFolder, rmdirResult)
		} else cb(err)
	}

	function rmdirResult(err) {
		if (!err) cb()
		else cb(err)
	}
}

function unwatch(cb) {
	if (unwatchers.length) {
		var u = unwatchers
		unwatchers = []
		require('haraldutil').p('unwatching:', u.length)
		u.forEach(function (fn) {
			fn()
		})
	}
	cb()
}