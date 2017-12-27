/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AwsInterface from './AwsInterface'

import fs from 'fs-extra'

const m = 'StackManager'

export default class StackManager extends AwsInterface {
  constructor(o = false) {
    super(o)
    const {stackName, templateFile, parameters} = o
    Object.assign(this, {stackName, templateFile, parameters})
  }

  async verifyState(state, stack = this.stackName) {
    const newState = await this.getStackStatus(stack)
    if (newState !== state) throw new Error(`Unexpected state for stack ${stack}: ${newState}, expected ${state}. Check CloudFormation Stacks Events on AWS Web site https://console.aws.amazon.com/cloudformation`)
    return newState
  }

  async createStack() {
    const cf = this.getService(AwsInterface.CloudFormation)
    const {stackName, templateFile, parameters} = this
    const response = await cf.createStack({
      StackName: stackName,
      Capabilities: ['CAPABILITY_IAM'],
      TemplateBody: await fs.readFile(templateFile, 'utf8'),
      Parameters: parameters,
    }).promise()
    const stackId = Object(response).StackId
    if (!stackId || typeof stackId !== 'string') throw new Error(`${m}: bad response from aws createStack`)
    return stackId
  }

  async waitWhile(whileInState) { // 171222 hr: aws-sdk has waitFor but it hangs. This here is similar
    let timer
    for (;;) {
      const state = await this.getStackStatus()
      if (state !== whileInState) break
      await new Promise((resolve, reject) => setTimeout(resolve, 5e3))
    }
  }

  async deleteStack(stack) {
    await this.getService(AwsInterface.CloudFormation)
      .deleteStack({StackName: this.stackName}).promise()
  }

  async getStackStatus(name = this.stackName) {
    const cf = this.getService(AwsInterface.CloudFormation)
    const response = await cf.listStacks().promise()
    const stackSummaries = Object(response).StackSummaries
    if (!Array.isArray(stackSummaries)) throw new Error(`${m}: bad AWS response for listStacks`)
    for (let stack of stackSummaries) {
      const stackName = Object(stack).StackName
      if (!stackName || typeof stackName !== 'string') throw new Error(`${m}: bad AWS StackName`)
      if (stackName === name) {
        const stackStatus = stack.StackStatus
        if (!stackStatus || typeof stackStatus !== 'string') throw new Error(`${m}: bad AWS StackStatus`)
        return stackStatus
      }
    }
    return null
  }
}