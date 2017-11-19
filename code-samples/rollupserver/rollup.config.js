/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// Rollup ECMAScript 2017
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'

const dependencyList = Object.keys(Object(Object(require('./package.json')).dependencies))

const babelOptions = {
  external: ['assert', 'buffer', 'constants', 'events', 'fs', 'path', 'util', 'stream', 'fsevents']
    .concat(dependencyList),
  plugins: [
    babel({
      include: '**/*.js',
      exclude: 'node_modules/**',
    }),
    resolve(),
    json(),
    commonjs(),
  ],
}

export default [Object.assign({
  input: 'src/runserver',
  output: {file: 'build/runserver.js', format: 'cjs'},
}, babelOptions), Object.assign({
  input: 'src/server',
  output: {file: 'build/server.js', format: 'cjs'},
}, babelOptions)]
