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
  input: '6-babelhelpers/helper',
  output: {file: '6-babelhelpers/helper.t3-both.js', format: 'cjs'},
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      include: '**/*.js', // exclude node_modules from parent directories
      exclude: 'node_modules/**', // exclude our node_modules
      presets: [['env', {modules: false}]],
      plugins: [
        'external-helpers',
        'transform-runtime',
      ],
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
