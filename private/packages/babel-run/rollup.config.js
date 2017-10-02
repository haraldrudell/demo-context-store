/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// ECMAScipt 2015 as supported by rollup. No class properties, async generators or object spread operator

import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import shebangPlugin from 'rollup-plugin-shebang'

import fs from 'fs'

export default {
  input: 'src/babel-run',
  output: {file: 'build/babel-run', format: 'cjs'},
  external: [
    'babel-core',
    'fs-extra',
    'child_process',
    'path',
  ],
  plugins:  [
    eslint({include: '**/*.js', exclude: 'node_modules/**'}),
    babel({
      babelrc: false, // unlike babel-node, rollup fails if an es2015 module transformer is included
      presets: [['env', {modules: false, targets: {node: '4.8.1'}}]],
      plugins: [
        'external-helpers',
        'transform-class-properties',
      ],
    }),
    shebangPlugin(),
    new function chmodPlugin(mode) {
      return {
        name: 'chmodPlugin',
        onwrite(bundle, data) {
          const filename = bundle && (bundle.file || bundle.dest)
          if (!filename) throw new Error('chmodPlugin.onwrite: filename missing')
          fs.chmodSync(filename, mode >= 0 ? Number(mode) : 0o755) // rwxr-xr-x
        },
      }
    }(),
  ],
}
