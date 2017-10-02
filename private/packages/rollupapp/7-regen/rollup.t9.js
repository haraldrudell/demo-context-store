/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import util from 'util'
import path from 'path'
import {Hash} from 'crypto'

const input = '7-regen/regen'

const config = []
export default config

config.push(getConfig({input, output: `${input}-cjs`, plugins: () => [getBabel({
    babelrc: false,
    runtimeHelpers: true,
    include: '**/*.js',
    presets: [['env', {modules: false}]],
    plugins: [
      'transform-runtime',
//      'external-helpers',
//      ['transform-runtime', {polyfill: false}],
    ],
  }),
  resolve(),
  commonjs(),
  sha256Plugin(),
]}))

function getConfig({input, output, plugins}) {
  output += '.js'
  console.log(`node ${output}`)
  const config = {
    input,
    output: {file: output, format: 'cjs'},
    plugins: plugins(),
  }

  console.log(`Rollup configuration: ${util.inspect(config, {colors: true, depth: null})}`)

  return config
}

function getBabel(babelOptions) {
  console.log(`Babel options: ${util.inspect(babelOptions, {colors: true, depth: null})}`)
  return babel(babelOptions)
}

function sha256Plugin() {
  return {
    name: 'sha256Plugin',
    onwrite(bundle, data) {
      const {code} = data
      console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
    },
  }
}
