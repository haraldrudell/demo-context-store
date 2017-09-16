/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Monitor from './Monitor'
import {getCmdLines} from './spawner'

export default class CommandMonitor extends Monitor {
  constructor(o) {
    super(o || false)
    const {errorHandler} = o || false
    const eh = typeof errorHandler
    if (eh !== 'function') throw new Error(`CommandMonitor: errorHandler not function: ${eh}`)
    Object.assign(this, {errorHandler})
  }

  issueCommand(o) {
    return getCmdLines(o).then(this.unexpectedExit).catch(this.errorHandler)
  }

  unexpectedExit = status => {
    console.error('CommandMonitor.unexpectedExit')
    this.errorHandler(new Error(`${this.printable}: unexpected command exit`))
  }
}
