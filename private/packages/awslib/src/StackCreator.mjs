/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackBase from './StackBase'

export default class StackCreator extends StackBase {
  static typicalCreateSeconds = 40

  async create({templateBody}) {
    const {typicalCreateSeconds} = StackCreator
    console.log(`Finding matching stacks for: ${this.getStackDescription()}`)
    let e
    await this.getOneStack().catch(ee => (e = ee))
    const {no} = e || false
    if (e && no !== 0) { // 2 or more stacks matched
      console.log(`matching count: ${no}. Use stack identifier`)
      throw e
    } else if (no === 1) console.log(`Unique match: ${this.getStackDescription()}`)
    const {stackName} = this
    console.log(`Checking status of stack: ${stackName}`)
    const stackStatus = await this.getStackStatus()
    console.log(`${stackName}: ${stackStatus || 'does not exist'}`)
  /* eslint-disable no-fallthrough */
  switch (stackStatus) {
      case 'ROLLBACK_IN_PROGRESS':
        console.log(`waiting for: ${stackName} ${new Date().toISOString()}…`)
        await this.waitWhile('ROLLBACK_IN_PROGRESS')
      case 'ROLLBACK_COMPLETE':
        console.log(`Initiating delete of ${stackName}…`)
        await this.deleteStack()
      case 'DELETE_IN_PROGRESS':
        console.log(`waiting for: ${stackName} ${new Date().toISOString()}…`)
        await this.waitWhile('DELETE_IN_PROGRESS')
      case 'DELETE_COMPLETE':
      case null: // the task does not exist at all
        console.log(`Initiating create of ${stackName}…`)
        const stackId = await this.createStack({templateBody})
        console.log(`stack id: ${stackId}`)
      case 'CREATE_IN_PROGRESS':
        const t0 = Date.now()
        console.log(`waiting for: ${stackName} [${typicalCreateSeconds} s] ${new Date(t0).toISOString()}`)
        await this.waitWhile('CREATE_IN_PROGRESS')
        const duration = (Date.now() - t0) / 1e3
        console.log(`Done in ${duration.toFixed(1)} s! verifying…`)
        const newState = await this.verifyState('CREATE_COMPLETE')
        console.log(`${stackName}: ${newState}`)
      case 'CREATE_COMPLETE':
        break
      default:
        throw new Error(`Unknown stack state for ${stackName}: ${stackStatus}`)
    }
  /* eslint-enable no-fallthrough */
  }
}
