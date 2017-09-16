// Gruntfile.js
// personalpresence grunt
// © 2013 Harald Rudell <harald.rudell@therudells.com> (http://haraldrudell.com) All rights reserved.

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunts')
	grunt.registerTask('default', 'watch')

	grunt.initConfig({
		simplemocha: {
			options: {
				ignoreLeaks: false,
				ui: 'exports',
				reporter: 'spec',
			},
			all: {
				src: ['test/test-*.js'],
			},
		},
		watch: {
			scripts: {
				files: ['lib/*.js', 'lib/views/**/*.js'],
				tasks: ['simplemocha'],
				options: {
					interrupt: true,
					debounceDelay: 250,
				},
			},
		},
	})
}
