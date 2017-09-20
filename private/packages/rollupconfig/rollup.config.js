/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import {deleteUndefined, getRollupOutput, assembleConfig} from './src/RollupPackageJson'
import babelPrintFilename from './src/babelPrintFilename'
import cleanPlugin from './src/cleanPlugin'
import chmodPlugin from './src/chmodPlugin'
import warningsMuffler from './src/warningsMuffler'

import eslint from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import shebangPlugin from 'rollup-plugin-shebang'

import util from 'util'

export default assembleConfig(getBaseConfig, getConfig)

function getConfig({baseConfig, input, main, module, output, external, shebang, clean, print}) {
  const config = Object.assign({}, baseConfig, {
    input,
    output: getRollupOutput({main, module, output}),
    external,
    onwarn: warningsMuffler,
    plugins: baseConfig.plugins.concat(shebang ? [shebangPlugin(), chmodPlugin()] : [])
      .concat(clean ? cleanPlugin(clean) : []),
  })
  deleteUndefined(config)

  if (print) console.log(`Rollup options for ${input}: ${util.inspect(config, {colors: true, depth: null})}`)
  return config
}

function getBaseConfig({print}) {
  const includeExclude = {
    include: '**/*.js',
    exclude: 'node_modules/**',
  }
  const babelOptions = Object.assign({
    babelrc: false, // unlike babel-node, rollup fails if an es2015 module transformer is included
    presets: [['env', {modules: false}]],
    plugins: [
      'external-helpers',
      ['transform-runtime', {helpers: false, polyfill: false,
        moduleName: 'rollup-regenerator-runtime',
      }],
    ].concat(print ? babelPrintFilename : [])
  }, includeExclude)

  if (print) console.log('Rollup-Babel options:', util.inspect(babelOptions, {colors: true, depth: null}))

  return {plugins: [
    eslint(includeExclude),
    babel(babelOptions),
    resolve(),
    commonjs(),
  ]}
}
