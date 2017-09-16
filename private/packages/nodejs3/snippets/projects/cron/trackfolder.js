// trackfolder.js
// maintains a repository for a folder

// git will require a file .git in the root of the files to be versioned
// http://nodejs.org/docs/latest/api/all.html#file_System
var fs = require('fs')
var exec = require('child_process').exec

var exportsObject = {
	createData: createData,
}

var text1 = 'first version'
var text2 = 'second version'
var text3 = 'file2'
var gitTagCounter = 1

var dataFolder = __dirname + '/data'
var gitFolder = __dirname + '/gitdata'

var states = {
	items: {
		dataFolder: dataFolder,
		file1: dataFolder + '/a.txt',
		file2: dataFolder + '/b.txt',
		gitFolder: gitFolder,
	},
	0: { // everything deleted
		dataFolder: false,
		file1: false,
		file2: false,
		gitFolder: false,
	},
	1: { // file1 with initial content
		dataFolder: 2,
		file1: text1,
		file2: text3,
		gitFolder: false,
	},
	2: { // after git init
		dataFolder: 3,
		file1: text1,
		file2: text3,
		gitFolder: 11,
	},
	3: { // file 1 updated, file 2 deleted
		dataFolder: 2,
		file1: text2,
		file2: false,
		gitFolder: 11,
	},
	4: { // revert to state 2
		dataFolder: 3,
		file1: text1,
		file2: text3,
		gitFolder: 11,
	},
}

// for debug: if invoked from command line, run the tests
if (!module.parent) launchTests(exportsObject)
// in require: export tests to nodeunit
else module.exports = exportsObject

function createData(test) {
	console.log('\n\n\n === createData')
	// state 0: remove any existing data
	remove(states.items.dataFolder)
	remove(states.items.gitFolder)
	checkState(0)

	// state 1: create data before repository creation
	createFolder(states.items.dataFolder)
	createFolder(states.items.gitFolder)
	write(states.items.file1, states[1].file1)
	write(states.items.file2, states[1].file2)
	checkState(1)

	// state 2: one file committed
	gitInit(doUpdate, function() {
		checkState(2)
		write(states.items.file1, states[3].file1)
		remove(states.items.file2)
		doUpdate(function () {
			checkState(3)
			gitCheckout(function () {
				checkState(4)
				test.done()
			})
		})
	})

	function gitInit() {
		myGit('git init' + 
			' --separate-git-dir=' + states.items.gitFolder,
			arguments)
	}

	function doUpdate() {
		var args = arguments
		myGit('git add --all .',
			[ commit ])
		function commit() {
			myGit('git commit -m Commit' , [ tag ])
		}
		function tag() {
			myGit('git tag' +
				' -a v' + gitTagCounter++ +
				' -m TaggedState',
				[ status ])			
		}
		function status() {
			myGit('git status', args)			
		}
	}

	function gitCheckout() {
		myGit('git checkout' + 
			' -b v1branch' +
			' v1',
			arguments)
	}

	function myGit(cmd, args) {
		doGit(cmd, states.items.dataFolder, function () {
			var argumentsArray = Array.prototype.slice.call(args)
			var f = argumentsArray.shift()
			f.apply(this, argumentsArray)
		})
	}

	function doGit(cmd, cwd, callback) {
		var child = exec(cmd, { cwd: cwd }, function (error, stdout, stderr) {
			console.log('exec:(', cmd, ':', stdout, ')')
			test.equal(error, null, 'git exec returned error:' + error)
			if (stderr) {
				console.log('stderr(', cmd, ':', stderr, ')')
				test.ok(false, 'stderr!')
			}
			callback()
		})
	}

	function checkState(state) {
		console.log('checkstate:', state)
		var stateObject = states[state]
		test.ok(stateObject, 'State does not exist:' + state)
		var itemObject = states.items
		test.deepEqual(Object.keys(stateObject), Object.keys(itemObject), 'Corrupt states for state:' + state)
		for (itemName in itemObject) {
			var expected = stateObject[itemName]
			var actual = describeContent(itemObject[itemName])
			test.equal(actual, expected, 'State ' + state +
				' item ' + itemName + ' expected: ' + expected +
				' actual: ' + actual)
		}
	}

}

function remove(path) {
	var content = describeContent(path, true)
	if (typeof content == 'string') {
		// it is a file, delete it
		fs.unlinkSync(path)
	} else if (typeof content == 'number') {
		// it is a folder, delete it
		// node does not have rm -rf
		var children = fs.readdirSync(path)
		children.forEach(function(file) {
			remove(path + '/' + file)
		})
		fs.rmdirSync(path)
	}
}

// path: filename
// return value:
// false: does not exist
// string: is file with this content
// number: is folder with this number of files
// exception: some error
function  describeContent(path, ignoreCorruptFiles) {
	var result = false
	var stat
	var isFile
	try {
		// if it does not exist: ENOENT
		// if exists but is directory: EISDIR
		stat = fs.statSync(path)
		if (stat) {
			if (stat.isFile()) {
				isFile = true
				var data = read(path)
				if (typeof data == 'string') result = data
				else result = undefined
			} else if (stat.isDirectory()) {
				var count = countFiles(path)
				if (typeof count == 'number') result = count
				else result = undefined
			}
		}
	} catch (e) {
		var bad = true
		if (e instanceof Error) {
			// it was a file, it did not exist
			if (e.code == 'ENOENT') {
				bad = false
				result = false
//			} else if (!shouldBeFile && r.code == 'EISDIR') {
//				// looking for directory, found it
//				bad = false
//				result = true
			}
		}
		if (bad) throw e
	}

	if (typeof result == 'undefined' &&
		!(ignoreCorruptFiles && isFile)) throw Error('Corrupt:' + path)

	return result
}

function countFiles(folder) {
	var files = fs.readdirSync(folder)
	if (!Array.isArray(files)) throw Error('Listing folder failed:' + folder)
	return files.length
}

function createFolder(folder) {
	fs.mkdirSync(folder)
}

function write(file, data) {
	fs.writeFileSync(file, data)
}

function read(file) {
	var bufferData = fs.readFileSync(file)
	var result = bufferData ? bufferData.toString() : undefined
	return result
}

function launchTests(tests) {
	var assert = require('assert')
	var testNames = Object.keys(tests)
	var testIndex = 0
	var completedTests = 0
	var doneCount = 0
	assert.done = done

	next()

	function next() {
		if (testIndex < testNames.length) {
			var testName = testNames[testIndex++]
			console.log('Executing:', testName)
			tests[testName](assert)	
		} else {
			if (completedTests < testIndex) {
				throw Error('Some tests did not invoke done')
			}
		}
	}

	function done() {
		completedTests++		
		next()
	}
}
