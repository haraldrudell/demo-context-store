/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// Rollup ECMAScript 2017
import nodeModules from './nodepackages'

import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'

import path from 'path'

process.env.BABEL_ENV = 'node'
process.env.NODE_ENV = 'development'

const packageJsonAbsolute = path.resolve('package.json')

const dependencyList = Object.keys(Object(Object(require(packageJsonAbsolute)).dependencies))

const babelOptions = {
  external: nodeModules.concat(dependencyList),
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
  input: 'server/watchserver',
  output: {file: 'serverbuild/watchserver.js', format: 'cjs'},
}, babelOptions), Object.assign({
  input: 'server/server',
  output: {file: 'serverbuild/server.js', format: 'cjs'},
}, babelOptions)]
