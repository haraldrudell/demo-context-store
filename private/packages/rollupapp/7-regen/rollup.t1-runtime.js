/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import path from 'path'
import {Hash} from 'crypto'

export default {
  input: '7-regen/regen',
  output: {file: '7-regen/regen.t1-runtime.js', format: 'cjs'},
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      include: '**/*.js',
      presets: [['env', {modules: false}]],
      plugins: [
        'transform-runtime',
      ]
    }),
    new function sha256Plugin() {
      return {
        name: 'sha256Plugin',
        onwrite(bundle, data) {
          const {code} = data
          console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
        },
      }
    },
  ],
}
