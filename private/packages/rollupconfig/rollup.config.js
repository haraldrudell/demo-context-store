/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import PackageJson from './src/PackageJson'
import {getRollupOutput, deleteUndefined} from './src/output'
import babelPrintFilename from './src/babelPrintFilename'
import cleanPlugin from './src/cleanPlugin'
import chmodPlugin from './src/chmodPlugin'

import eslint from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'

const rollupList = []
export default rollupList

// read package.json
const pkg = new PackageJson() // cannot be imported because we don’t know where it is
const {input, external, rollup} = pkg
if (!input) throw new Error(`${pkg.filename}: rollup.input not defined`)
if (rollup.print) console.log('package.json rollup.print true: verbose output')

const plugins = getRollupPlugins(rollup)

rollupList.push({
  input,
  output: getRollupOutput(pkg),
  plugins,
  external,
}, {
  input: 'src/cleanbin.js',
  output: [{file: 'build/clean', format: 'cjs'}],
  plugins: [shebangPlugin(), chmodPlugin()].concat(plugins),
  external,
})

// remove properties that have undefined value
for (let config of rollupList) deleteUndefined(config)

if (rollup.print) console.log('Rollup options:', util.inspect(rollupList, {colors: true, depth: null}))

function getRollupPlugins(rollup) {
  const {print, clean} = rollup
  const includeExclude = {
    include: '**/*.js',
    exclude: 'node_modules/**',
  }
  const babelOptions = Object.assign({
    babelrc: false, // unlike babel-node, rollup fails if an es2015 module transformer is included
    plugins: [
      'transform-class-properties',
    ].concat(print ? babelPrintFilename : [])
  }, includeExclude)
  if (print) console.log('Rollup-Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))

  return [
    eslint(includeExclude),
    babel(babelOptions),
    resolve(),
    commonjs(),
    cleanPlugin(clean),
  ]
}
