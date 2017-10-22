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
  output: {file: '7-regen/regen.t4-regen.js', format: 'cjs'},
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
        ['transform-runtime', {helpers: false, polyfill: false,
          moduleName: 'rollup-regenerator-runtime'
        }],
        function printFilename() { // a babel plugin
          return {visitor: {
            Program(nodePass, pluginPass) {
              console.log(`babel: ${pluginPass.file.opts.filename}`)
            },
          }}
        },
      ]
    }),
    {name: 'idWriter',
      load(id) {
        console.log(`Rollup loading id: ${id}`)
      },
    },
    {name: 'sha256Plugin', // a rollup plugin
      onwrite(bundle, data) {
        const {code} = data
        console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
      },
    }
  ],
}