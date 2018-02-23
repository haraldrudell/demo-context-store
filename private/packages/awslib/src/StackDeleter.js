/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackCreator from './StackCreator'

export default class StackDeleter extends StackCreator {
  async delete() {
    const {stackName, stackId, stackStatus} = await this.getOneStack(this.filterStacks(await this.getStacks()))
    console.log(`stack: ${this.getStackDescription()}`)
    console.log(`status: ${stackStatus}`)
  /* eslint-disable no-fallthrough */
  switch (stackStatus) {
      case 'ROLLBACK_IN_PROGRESS':
      case 'CREATE_IN_PROGRESS':
        console.log(`waiting for: ${stackName} ${new Date().toISOString()}…`)
        await this.waitWhile(stackStatus)
      case 'ROLLBACK_COMPLETE':
      case 'CREATE_COMPLETE':
        console.log(`Initiating delete of ${stackName}…`)
        await this.deleteStack(stackId)
      case 'DELETE_IN_PROGRESS':
        console.log(`waiting for: ${stackName} ${new Date().toISOString()}…`)
        await this.waitWhile('DELETE_IN_PROGRESS')
        const newState = await this.verifyState('DELETE_COMPLETE')
        console.log(`${stackName}: ${newState}`)
      case 'DELETE_COMPLETE':
      case null: // the stack does not exist at all
        break
      default:
        throw new Error(`Unknown stack state for ${stackName}: ${stackStatus}`)
    }
  /* eslint-enable no-fallthrough */
}
}
