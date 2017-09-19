/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
Without babel:
ECMAScript 2015  import works
ECMAScript 2016 Exponentiation operator works
ECMAScript 2017 async works
stage-3 object rest spread does not work
*/
import util from 'util'

const config = {
  input: '3-no-rollup-babel/input.js',
  output: [{file: `3-no-rollup-babel/input-cjs.js`, format: 'cjs'}],
}
export default config
console.log(`node ${config.output[0].file}`)

console.log('Rollup configuration output for:', __filename)
console.log('config:', util.inspect(config, {colors: true, depth: null}))
