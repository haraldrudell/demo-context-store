/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator
import RollupConfigurator from './src/RollupConfigurator'
import babelPrintFilename from './src/babelPrintFilename'
import cleanPlugin from './src/cleanPlugin'
import chmodPlugin from './src/chmodPlugin'
import warningsMuffler from './src/warningsMuffler'

import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'

export default new RollupConfigurator().assembleConfig(getConfig)

function getConfig({input, main, module, output, external, shebang, clean, print}) {
  const includeExclude = {
    include: '**/*.js',
    exclude: 'node_modules/**',
  }
  let babelOptions

  const config = {
    input,
    output,
    external,
    onwarn: warningsMuffler,
    plugins:  [
      eslint(includeExclude),
      resolve({extensions: ['.js', '.json']}),
      commonjs(),
      json(), // required for import of .json files
      babel(babelOptions = Object.assign({
        babelrc: false, // unlike babel-node, rollup fails if an es2015 module transformer is included
        runtimeHelpers: true,
        presets: [['env', {modules: false, targets: {node: '4.8'}}]],
        plugins: ['transform-runtime'].concat(print ? babelPrintFilename : []),
      }, includeExclude)),
    ].concat(shebang ? [shebangPlugin(), chmodPlugin()] : [])
      .concat(clean ? cleanPlugin(clean) : []),
  }
  RollupConfigurator.deleteUndefined(config)

  if (print) {
    console.log(`Rollup options for ${input}: ${util.inspect(config, {colors: true, depth: null})}`)
    console.log('Rollup-Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))
  }

  return config
}
