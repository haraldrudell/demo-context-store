/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AwsSdk from './AwsSdk'
import {getNonEmptyString, getObject} from './typeVerifiers'
import {throwWithMethod} from './throwWithMethod'

import fs from 'fs-extra'

export default class StackShim extends AwsSdk {
  constructor(o) {
    super(o)
    !o && (o = false)
    this.m = String(o.name || 'StackShim')
    //this.stackName = getNonEmptyString(o.stackName, m => `${this.m} stackName: ${m}`)
    this.cf = this.getService('CloudFormation')
  }

  async verifyState(state, stack = this.stackName) {
    const newState = await this.getStackStatus(stack)
    if (newState !== state) throw new Error(`Unexpected state for stack ${stack}: ${newState}, expected ${state}. Check CloudFormation Stacks Events on AWS Web site https://console.aws.amazon.com/cloudformation`)
    return newState
  }

  async createStack(o) {
    const templateFile = getNonEmptyString(o.templateFile, m => `${this.m} templateFile: ${m}`)
    const parameters = getObject(o.parameters, m => `${this.m} parameters: ${m}`, undefined, true)
    const {cf, stackName} = this
    const response = await cf.createStack({
      StackName: stackName,
      Capabilities: ['CAPABILITY_IAM'],
      TemplateBody: await fs.readFile(templateFile, 'utf8'),
      Parameters: parameters,
    }).promise().catch(e => this.throwE(e, 'createStack'))
    const stackId = Object(response).StackId
    if (!stackId || typeof stackId !== 'string') throw new Error(`${this.m}: bad response from aws createStack`)
    return stackId
  }

  throwE = (e, m) => {
    console.error(`${this.m} ${m}:`)
    throw e
  }

  async waitWhile(whileInState) { // 171222 hr: aws-sdk has waitFor but it hangs. This here is similar
    for (;;) {
      const state = await this.getStackStatus()
      if (state !== whileInState) break
      await new Promise((resolve, reject) => setTimeout(resolve, 5e3))
    }
  }

  async deleteStack(stack) {
    await this.cf.deleteStack({StackName: this.stackName}).promise()
  }

  async getStacks() {
    return (await this.cf.listStacks().promise().catch(e => throwWithMethod(`${this.m}.getStacks`))).StackSummaries
  }

  async getStackNames() {
    return (await this.getStacks()).map(summary => summary.StackName)
  }

  async getStackStatus(name = this.stackName) { // string or null
    const cf = this.getService('CloudFormation')
    const response = await cf.listStacks().promise()
    const stackSummaries = Object(response).StackSummaries
    if (!Array.isArray(stackSummaries)) throw new Error(`${this.m}: bad AWS response for listStacks`)
    for (let stack of stackSummaries) {
      const stackName = Object(stack).StackName
      if (!stackName || typeof stackName !== 'string') throw new Error(`${this.m}: bad AWS StackName`)
      if (stackName === name) {
        const stackStatus = stack.StackStatus
        if (!stackStatus || typeof stackStatus !== 'string') throw new Error(`${this.m}: bad AWS StackStatus`)
        return stackStatus
      }
    }
    return null
  }

  getRegion() {
   return this.cf.config.region
  }
}
