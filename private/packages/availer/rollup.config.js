/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import rollupConfigGenerator from 'rollupconfig'
import {cleanPlugin} from 'clean'

// rollup input/output/external: https://rollupjs.org/#big-list-of-options
const inputOutputExternal = {
  input: 'src/run.js',
  output: [{file: 'build/availer.js', format: 'cjs'}],
  plugins: [cleanPlugin('lib')],
}
console.log(`node ${inputOutputExternal.output[0].file}`) // display how to execute result

export default rollupConfigGenerator({iox: inputOutputExternal, print: true, node: true, shebang: true})
