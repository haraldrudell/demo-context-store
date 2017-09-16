// gomemfill.js
// capture crash message from memfill.js

// TODO: log and rotate
// TODO: watch
// TODO: web frontend

// imports
// https://github.com/haraldrudell/haraldops
//var haraldops = require('haraldops')
// http://nodejs.org/docs/latest/api/child_process.html
var child_process = require('child_process')
// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')

var conf = {
	'memfill': {
		'spawn': {
			'command': 'node',
			'args': [ 'memfill.js' ],
		},
		'folder': __dirname,
	},
	'node-http': {
		'spawn': {
			'command': 'node',
			'args': [ 'nodeapi-http.js' ],
		},
		'folder': __dirname + '/../../nodeapi',
	},
}
var apps = getApps(conf)

if (false) apps.launch('memfill')
else apps.launchAll()

function getApps(conf) {
	var appsConf = conf

	return {
		launch: launch,
		launchAll: launchAll
	}

	function launch(id) {
		var parsed = this[id]
		if (!parsed) {
			var parsed = parse(appsConf, id)
			if (parsed) this[id] = parsed
		}
		if (parsed) {
			this.child = spawn(id, parsed.command, parsed.args)
		}
	}

	function launchAll() {
		Object.keys(appsConf).forEach(function (id) {
			launch(id)
		})
	}
}

function spawn(id, command, args) {
	// ch will always be an object
	var ch = child_process.spawn(command, args)
	ch.stdout.on('data', function (data) {
		// data is Buffer
		console.log(id, data.toString())
	})
	ch.stderr.on('data', function (data) {
		// data is Buffer
		console.log(id, data.toString())
	})
	ch.on('exit', function (code) {
		// code is number
		console.log(id + ' exit:', code)
	})
	return ch
}

// parse conf[id] and return result, undefined if problems
function parse(conf, id) {
	var result
	var myConf = {}

	do {
		// get the app configuration
		if (!conf) {
			console.log('launch: no global conf object')
			break
		}
		var theConf = conf[id]
		if (!theConf) {
			console.log('launch: config not found:' + id)
			break
		}

		// get command
		myConf.command = theConf.spawn.command && theConf.spawn.command.valueOf() ||
			'node'
		if (typeof myConf.command != 'string') {
			console.log('launch: no command for:' + id, typeof myConf.command, myConf.command)
			break
		}

		// get arguments
		myConf.args = []
		var bad  = true
		if (Array.isArray(theConf.spawn.args)) {
			bad = !theConf.spawn.args.every(function (arg) {
				var result = false
				var f = arg && arg.valueOf()
				if (typeof f == 'string') {
					result = true
					myConf.args.push(f)
				}
				return result
			})
		} else {
			var f = theConf.spawn.args && theConf.spawn.args.valueOf()
			if (typeof f =='string') {
				myConf.args.push(f)
				bad = false
			}
		}
		if (bad) {
			console.log('launch: bad arguments for:' + id)
			break
		}

		// get folder
		var folder = theConf.folder
		if (folder) {
			folder = path.resolve(folder)
			if (getType(folder) !== false) {
				console.log('launch: not a directory:' + folder)
				break
			}
		} else {
			folder = process.cwd()
		}

		// add folder if command is node
		if (myConf.command == 'node') {
			// add path to script argument
			var e
			myConf.args.every(function (arg, index, args) {
				var result = true
				var ch =  arg.charAt(0)
				if (ch != '-') {
					result = false
					if (ch != '/') {
						var newArg = path.join(folder, arg)
						if (getType(newArg) !== true) {
							console.log('launch: not a file:' + newArg)
							e = true
						} else {
							args[index] = newArg
						}
					}
				}
				return result
			})
			if (e) break
		}

		result = myConf
	} while (false)
	
	return result
}

// undefined: does not exist or is weird type
// false: directory
// true: file
function getType(aPath) {
	var result

	try {
		var stats = fs.statSync(aPath)
	} catch (e) {
		var bad = true
		if (e instanceof Error && e.code == 'ENOENT') bad = false
		if (bad) throw e
	}
	if (stats) {
		if (stats.isFile()) result = true
		else if (stats.isDirectory()) result = false
	}

	return result
}

	// launch memfill
	// basic spawn
	// child_process.spawn(command, [args], [options])
	// options Object
	// cwd String Current working directory of the child process
	// customFds Array Deprecated File descriptors for the child to use for stdio. (See below)
	// env Object Environment key-value pairs
	// setsid Boolean
