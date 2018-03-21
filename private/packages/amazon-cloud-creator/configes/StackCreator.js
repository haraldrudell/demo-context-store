/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackManager from './StackManager'

const m = 'StackCreator'

export default class StackCreator extends StackManager {
  typicalCreateSeconds = 40

  async run() {
    const {stackName: stack} = this
    console.log(`Checking status of stack: ${stack}`)
    const stackStatus = await this.getStackStatus()
    console.log(`${stack}: ${stackStatus}`)
    switch (stackStatus) {
      case 'ROLLBACK_IN_PROGRESS':
        console.log(`waiting for: ${stack} ${new Date().toISOString()}…`)
        await this.waitWhile('ROLLBACK_IN_PROGRESS')
      case 'ROLLBACK_COMPLETE':
        console.log(`Initiating delete of ${stack}…`)
        await this.deleteStack()
      case 'DELETE_IN_PROGRESS':
        console.log(`waiting for: ${stack} ${new Date().toISOString()}…`)
        await this.waitWhile('DELETE_IN_PROGRESS')
      case 'DELETE_COMPLETE':
      case null: // the task does not exist at all
        console.log(`Initiating create of ${stack}…`)
        const stackId = await this.createStack()
        console.log(`stack id: ${stackId}`)
      case 'CREATE_IN_PROGRESS':
        const t0 = Date.now()
        console.log(`waiting for: ${stack} [${this.typicalCreateSeconds} s] ${new Date(t0).toISOString()}`)
        await this.waitWhile('CREATE_IN_PROGRESS')
        const duration = (Date.now() - t0) / 1e3
        console.log(`Done in ${duration.toFixed(1)} s! verifying…`)
        const newState = await this.verifyState('CREATE_COMPLETE')
        console.log(`${stack}: ${newState}`)
      case 'CREATE_COMPLETE':
        break
      default:
        throw new Error(`Unknown stack state for ${stack}: ${stackStatus}`)
    }
  }
}
