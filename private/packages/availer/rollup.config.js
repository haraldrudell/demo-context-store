/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
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
