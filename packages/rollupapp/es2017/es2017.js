 /*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import es2017module from './es2017module'
import util from 'util'

console.log('es2017')

const a = {aprop: 1}
console.log(`es2017 object-rest-spread: ${util.inspect({b: 2, ...a}, {colors: true, depth: null})}`)

console.log(`es2017 es2017module: ${es2017module}`)
es2017module()

console.log('es2017 complete.')
