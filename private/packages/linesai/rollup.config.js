/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import pkg from './package.json'
import rollupConfigGenerator from 'rollupconfig'

// rollup input/output/external: https://rollupjs.org/#big-list-of-options
if (!pkg.main) throw new Error('package.json main field not set')
const inputOutputExternal = {
  input: 'src/linesai.js',
  output: [{file: `${pkg.main}.js`, format: 'cjs'}],
}
console.log(`node ${inputOutputExternal.output[0].file}`) // display how to execute result

export default rollupConfigGenerator({iox: inputOutputExternal, node: true, print: true})
