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
  output: {file: '7-regen/regen.t7-n8.js', format: 'cjs'},
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      include: '**/*.js', // exclude node_modules from parent directories
      exclude: 'node_modules/**', // exclude our node_modules
      plugins: [
        'transform-class-properties', // class f { a = 1… stage-2 170919
        'transform-object-rest-spread', // {...o} stage-3 170919
        'transform-export-extensions', // export * as ns… export a from… stage-1 170919
        'transform-async-generator-functions', // for await… stage-3 170919
        'transform-es2015-block-scoping',
        ['transform-es2015-for-of', {loose: true}],
        'transform-inline-consecutive-adds',
        'minify-dead-code-elimination',
        ]
    }),
    {name: 'sha256Plugin', // a rollup plugin
      onwrite(bundle, data) {
        const {code} = data
        console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
      },
    }
  ],
}
