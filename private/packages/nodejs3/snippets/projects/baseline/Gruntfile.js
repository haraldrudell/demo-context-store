// Gruntfile.js
// Baseline grunt
// © Harald Rudell 2013 <harald@allgoodapps.com> All rights reserved.
// npm install <module> --save-dev

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-simple-mocha')
	grunt.loadNpmTasks('grunt-contrib-watch')

// istanbul
var tasks = ['lib/*.js', 'baseline.js']
var reportDir = 'build/reports/'

	grunt.initConfig({
		simplemocha: {
			options: {
				ignoreLeaks: false,
				ui: 'exports',
				reporter: 'spec',
			},
			all: {
				src: ['test/*.js'],
			},
		},
		watch: {
			serverUnitTests: {
				files: ['lib/*.js'],
				tasks: ['simplemocha'],
				options: {
					interrupt: true,
					debounceDelay: 250,
				},
			},
		},

// istanbul
		clean: ['build'],
		instrument : {
			files : tasks,
			options : {
				basePath : 'build/instrument/',
			},
		},
		reloadTasks : {
			rootPath : 'build/instrument/lib',
		},
		makeReport : {
			src : 'build/reports/**/*.json',
			options : {
				type : 'lcov',
				dir : reportDir,
				print : 'detail',
			},
		},
	})

// istanbul
	grunt.registerTask('runtests', 'Run Mocha test coverage', function () {
		var done = this.async()
		var path = require('path')

		var mocha = new (require('mocha'))({
			ui: 'exports',
			reporter: 'spec',
		})
		mocha.addFile(path.join(__dirname, 'test', 'test-baseline'))
		mocha.addFile(path.join(__dirname, 'test', 'test-calculate'))
		mocha.run(end)

		function end(failures) {
			grunt.log.writeln('Failures: ' + typeof failures + failures)
			done(!failures)
		}
	})

	grunt.registerTask('coverage', 'Test coverage using Istanbul and Mocha', function () {
		var done = this.async()
		grunt.log.writeln('istanbul now')
		grunt.util.spawn({
//			cmd: 'touch',
//			args: ['x.x'],
			cmd: 'istanbul',
			args: ['cover', '-x', 'Gruntfile.js', 'grunt', 'simplemocha'],
		}, function () {
			grunt.log.writeln('istanbul done')
			grunt.util.spawn({
				cmd: 'chromium-browser',
				args: ['/home/foxyboy/Desktop/c505/node/baseline/coverage/lcov-report/index.html'],
			}, function () {
				grunt.log.writeln('chromium done')
				done()
			})
		})
		grunt.log.writeln('after spawn')
	})
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-istanbul')
	grunt.registerTask('cover2', ['clean', 'instrument', 'reloadTasks', 'runtests',
		'storeCoverage', 'makeReport'])

	grunt.registerTask('default', 'watch')
}
