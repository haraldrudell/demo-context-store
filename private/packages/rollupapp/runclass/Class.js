/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import util from 'util'
import spawn from 'spawn-async'

export default class Class {
  async run(args) {
    console.log(`Class args: ${util.inspect(args, {colors: true, depth: null})}`)
    console.log(`Class spawn: ${util.inspect(spawn, {colors: true, depth: null})}`)
    const value = await spawn({cmd: 'date'})
    console.log(`Class completed successfully. value: ${util.inspect(value, {colors: true, depth: null})}`)
  }
}