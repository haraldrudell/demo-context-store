/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import pkg from './package.json'
import {devDependencies as lernaDependencies} from '../../package.json'
import eslint from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeIgnores from './src/nodepackages'

if (!pkg.main) throw new Error('package.json main field not set')
export default {
  input: 'src/rollupConfigGenerator.js',
  output: [{file: `${pkg.main}.js`, format: 'cjs'}],
  external: nodeIgnores.concat(Object.keys(lernaDependencies || {})),
  plugins: [
    eslint(),
    babel({
      babelrc: false,
      include: '**/*.js',
      exclude: 'node_modules/**',
      plugins: [
        (babel) => ({
          visitor: {
            Program: (nodePass, pluginPass) => console.log('source file:', pluginPass.file.opts.filename)
          }
        }),
        'transform-class-properties',
        'transform-object-rest-spread',
      ],
    }),
    json(),
    resolve({preferBuiltins: true}),
    commonjs(),
  ],
}
