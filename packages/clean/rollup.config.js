/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import pkg from './package.json'
import lerna from '../../package.json'
import rollupConfigGenerator from 'rollupconfig'

// rollup input/output/external: https://rollupjs.org/#big-list-of-options
if (!pkg.main) throw new Error('package.json main field not set')
const inputOutputExternal = {
  input: 'src/clean.js',
  output: [{file: `${pkg.main}.js`, format: 'cjs'}],
  external: Object.keys(pkg.dependencies || {}).concat(Object.keys(lerna.devDependencies || {})),
}
console.log(`node ${inputOutputExternal.output[0].file}`) // display how to execute result

const clean = {
  input: 'src/cleanbin.js',
  output: [{file: 'lib/clean.js', format: 'cjs'}],
  external: inputOutputExternal.external,
}

export default [
  rollupConfigGenerator({iox: inputOutputExternal, node: true, print: true}),
  rollupConfigGenerator({iox: clean, node: true, print: true, shebang: true}),
]