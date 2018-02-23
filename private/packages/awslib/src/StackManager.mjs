/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackUpdater from './StackUpdater'

import util from 'util'

export default class StackManager extends StackUpdater {
  constructor(o) {
    super({name: 'StackManager', ...o})
    this.debug && this.constructor === StackManager && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: 2})}`)
  }

  setStackName(stackName) {
    this.stackName = stackName == null ? null : String(stackName)
  }

  async listStacks() {
    const {sm} = this
    return (await sm.getStacks()).map(summary => summary.StackName)
  }
}
