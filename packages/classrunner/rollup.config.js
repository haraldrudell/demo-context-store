/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
import pkg from './package.json'
import rollupConfigGenerator from 'rollupconfig'
import {cleanPlugin} from 'clean'

// rollup input/output/external: https://rollupjs.org/#big-list-of-options
if (!pkg.main) throw new Error('package.json main field not set')
const inputOutputExternal = {
  input: 'src/classRunner.js',
  output: [{file: `${pkg.main}.js`, format: 'cjs', exports: 'named'}],
  plugins: [cleanPlugin('lib')],
}
console.log(`node ${inputOutputExternal.output[0].file}`) // display how to execute result

export default rollupConfigGenerator({iox: inputOutputExternal, print: true, node: true})
