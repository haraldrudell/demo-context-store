/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import PackageJson from './src/PackageJson'
import getRollupOutput from './src/output'

import eslint from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const rollupList = []
export default rollupList

// read package.json
const pkg = new PackageJson() // cannot be imported because we don’t know where it is
const {input, external, rollup} = pkg

const plugins = getRollupPlugins()

rollupList.push(Object.assign({
  input,
  output = getRollupOutput({pkg}),
  plugins,
}, rollupBase), Object.assign({
  input: 'src/cleanbin.js',
  output: [{file: 'build/clean', format: 'cjs'}],
  plugins,
}, rollupBase))

function getRollupPlugins() {
  return [
    eslint(),
    babel({
      babelrc: false,
      include: '**/*.js',
      exclude: 'node_modules/**',
      plugins: [
        'transform-class-properties',
        'transform-object-rest-spread',
      ],
    }),
    json(),
    resolve({preferBuiltins: true}),
    commonjs(),
  ]
}
