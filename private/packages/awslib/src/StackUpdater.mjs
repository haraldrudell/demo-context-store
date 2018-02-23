/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackDeleter from './StackDeleter'

export default class StackUpdater extends StackDeleter {
  async update({templateBody}) {
    console.log(`finding matching stacks for: ${this.getStackDescription()}`)
    let {stackStatus} = await this.getOneStack()
    const {stackName} = this
    console.log(`stack: ${this.getStackDescription()}`)
    console.log(`status: ${stackStatus}`)
    for (;;) {
      let expect = undefined
      /* eslint-disable no-fallthrough */
      switch (stackStatus) {
        case 'DELETE_IN_PROGRESS':
        case 'DELETE_COMPLETE':
          console.log(`stack is deleted. use -deploy`)
          return
        case 'ROLLBACK_IN_PROGRESS':
          expect = 'ROLLBACK_COMPLETE'
          break
        case 'CREATE_IN_PROGRESS':
          expect = 'CREATE_COMPLETE'
          break
        case 'UPDATE_ROLLBACK':
          expect = 'UPDATE_ROLLBACK_COMPLETE'
          break
        case 'ROLLBACK_COMPLETE':
        case 'CREATE_COMPLETE':
        case 'UPDATE_ROLLBACK_COMPLETE':
        case 'UPDATE_COMPLETE':
          break
        default:
          throw new Error(`Unknown stack state for ${stackName}: ${stackStatus}`)
      }
      /* eslint-enable no-fallthrough */
      if (!expect) break
      console.log(`waiting for: ${stackName} ${new Date().toISOString()}…`)
      stackStatus = await this.waitWhile(stackStatus)
      console.log(`status: ${stackStatus}`)
      if (stackStatus === expect) break
    }
    console.log(`Initiating update of ${stackName}…`)
    const t0 = Date.now()
    await this.updateStack({templateBody})
    await this.waitWhile('UPDATE_IN_PROGRESS')
    const duration = (Date.now() - t0) / 1e3
    console.log(`Done in ${duration.toFixed(1)} s! verifying…`)
    await this.verifyState('UPDATE_COMPLETE') // TODO what is the state?
    console.log('ok')
  }
}
