/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import pkg from './package.json'
import rollupConfigGenerator from 'rollupconfig'
import {cleanPlugin} from 'clean'

// rollup input/output/external: https://rollupjs.org/#big-list-of-options
const m = pkg.main
if (!m || typeof m !== 'string') throw new Error('package.json main field not non-empty string')
const slashIndex = m.lastIndexOf('/')
const hasExtension = !!~m.indexOf('.', ~slashIndex ? slashIndex : 0)
const main = `${m}${hasExtension ? '' : '.js'}`

const inputOutputExternal = {
  input: 'src/LineReader.js',
  output: [{file: main, format: 'cjs'}],
  plugins: [cleanPlugin('lib')],
}
console.log(`node ${inputOutputExternal.output[0].file}`) // display how to execute result

export default rollupConfigGenerator({iox: inputOutputExternal, node: true, print: true})
