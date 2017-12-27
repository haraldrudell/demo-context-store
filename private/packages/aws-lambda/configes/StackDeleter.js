/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackManager from './StackManager'

export default class StackDeleter extends StackManager {
  async run() {
    const {stackName: stack} = this
    console.log(`Checking status of stack: ${stack}`)
    const stackStatus = await this.getStackStatus()
    console.log(`${stack}: ${stackStatus}`)
    switch (stackStatus) {
      case 'ROLLBACK_IN_PROGRESS':
      case 'CREATE_IN_PROGRESS':
        console.log(`waiting for: ${stack} ${new Date().toISOString()}…`)
        await this.waitWhile(stackStatus)
      case 'ROLLBACK_COMPLETE':
      case 'CREATE_COMPLETE':
        console.log(`Initiating delete of ${stack}…`)
        await this.deleteStack()
      case 'DELETE_IN_PROGRESS':
        console.log(`waiting for: ${stack} ${new Date().toISOString()}…`)
        await this.waitWhile('DELETE_IN_PROGRESS')
        const newState = await this.verifyState('DELETE_COMPLETE')
        console.log(`${stack}: ${newState}`)
      case 'DELETE_COMPLETE':
      case null: // the stack does not exist at all
        break
      default:
        throw new Error(`Unknown stack state for ${stack}: ${stackStatus}`)
    }
  }
}
