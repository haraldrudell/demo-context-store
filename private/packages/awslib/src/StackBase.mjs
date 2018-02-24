/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AwsSdk from './AwsSdk'

import {throwWithMethod, getNonEmptyString, getNonEmptyStringOrUndefined} from 'es2049lib'

import util from 'util'

export default class StackBase extends AwsSdk {
  constructor(o) {
    super({name: 'StackBase', ...o})
    const {stackName, stackId, region} = Object(o)
    let s = {}
    if (getNonEmptyStringOrUndefined({stackName, s})) throw new Error(`${this.m} stackName: ${s.text}`)
    if (getNonEmptyStringOrUndefined({stackId, s})) throw new Error(`${this.m} stackId: ${s.text}`)
    if (getNonEmptyStringOrUndefined({region, s})) throw new Error(`${this.m} stackName: ${s.text}`)
    Object.assign(this, s.properties)
    this.cfo = this.getService('CloudFormation')
    this.debug && this.constructor === StackBase && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async verifyState(state) {
    const {stackStatus} = await this.getOneStack()
    if (stackStatus !== state) {
      await this.getEvents()
      throw new Error(`Unexpected state: ${stackStatus}, expected ${state} for stack ${this.getStackDescription()} Check CloudFormation Stacks Events on AWS Web site https://console.aws.amazon.com/cloudformation`)
    }
    return stackStatus
  }

  getStackDescription() {
    const {stackName, stackId} = this
    if (!stackName && !stackId) throw new Error(`${this.m} getStackDescription assert`)
    const spacing = stackName && stackId ? '\x20' : ''
    return `${stackName}${spacing}${stackId}`
  }

  async getEvents() {
    const {stackName: StackName, cfo} = this
    const r = await cfo.describeStackEvents({StackName}).promise().catch(e => this.throwE(e, 'getEvents'))
    /*
      {ResponseMetadata: { RequestId: 'a75262f6-178a-11e8-a168-2f9d0017f855' },
      StackEvents: [{
        StackId: 'arn:aws:cloudformation:us-west-2:038774786854:stack/c33/d2450460-176e-11e8-b1fe-503ac9841afd',
        EventId: '96d9acd0-1784-11e8-966d-500c33711061',
        StackName: 'c33',
        LogicalResourceId: 'c33',
        PhysicalResourceId: 'arn:aws:cloudformation:us-west-2:038774786854:stack/c33/d2450460-176e-11e8-b1fe-503ac9841afd',
        ResourceType: 'AWS::CloudFormation::Stack',
        Timestamp: 2018-02-22T03:58:06.867Z,
        ResourceStatus: 'CREATE_COMPLETE' },
    */
    const recs = Object(r).StackEvents
    if (!Array.isArray(recs)) throw new Error(`${this.m} AWS bad describeStackEvents response`)
    for (let {ResourceStatus, ResourceStatusReason} of recs) console.log({ResourceStatus, ResourceStatusReason})
  }

  async createStack(o) {
    const {templateBody, availabilityZone} = o || false
    const {stackName, cfo} = this
    let s = {}
    if (getNonEmptyString({templateBody, s})) throw new Error(`${this.m} templateBody: ${s.text}`)
    const args = {
      StackName: stackName,
      Capabilities: ['CAPABILITY_IAM'],
      TemplateBody: templateBody,
    }
    availabilityZone && Object.assign(args, {Parameters: [{
      ParameterKey: 'AvailabilityZone',
      ParameterValue: availabilityZone,
      }]})
    let e
    const response = await cfo.createStack(args).promise().catch(ee => (e = ee))
    /*
    {ResponseMetadata: {RequestId: '16a6aba3-1764-11e8-af53-d1eaaf262ac0' },
      StackId: 'arn:aws:cloudformation:us-west-2:038774786854:stack/undefined/16ae4bd0-1764-11e8-a64e-503ac9ec2435' }
     */
    if (e) {
      await this.getEvents().catch(console.error)
      this.throwE(e, 'createStack')
    }
    const stackId = Object(response).StackId
    if (getNonEmptyString({stackId, s})) throw new Error(`${this.m}: aws response stackId: ${s.text}`)
    return stackId
  }

  throwE = (e, m) => {
    console.error(`${this.m} ${m}:`)
    throw e
  }

  async updateStack(o) {
    const {templateBody, availabilityZone} = Object(o)
    const {stackName, cfo} = this
    let s = {}
    if (getNonEmptyString({templateBody, s})) throw new Error(`${this.m} templateBody: ${s.text}`)
    const args = {
      StackName: stackName,
      Capabilities: ['CAPABILITY_IAM'],
      TemplateBody: templateBody,
    }
    availabilityZone && Object.assign(args, {Parameters: [{
      ParameterKey: 'AvailabilityZone',
      ParameterValue: availabilityZone,
      }]})
    let e
    const response = await cfo.updateStack(args).promise().catch(ee => (e = ee))
    /*
    {ResponseMetadata: {RequestId: '16a6aba3-1764-11e8-af53-d1eaaf262ac0' },
      StackId: 'arn:aws:cloudformation:us-west-2:038774786854:stack/undefined/16ae4bd0-1764-11e8-a64e-503ac9ec2435' }
     */
    if (e) {
      await this.getEvents().catch(console.error)
      this.throwE(e, 'createStack')
    }

    const stackId = Object(response).StackId
    if (getNonEmptyString({stackId, s})) throw new Error(`${this.m}: aws response stackId: ${s.text}`)
    return stackId
  }

  async waitWhile(whileInState) { // 171222 hr: aws-sdk has waitFor but it hangs. This here is similar
    for (;;) {
      const {stackStatus} = await this.getOneStack()
      if (stackStatus !== whileInState) return stackStatus
      await new Promise((resolve, reject) => setTimeout(resolve, 5e3))
    }
  }

  async deleteStack(stackNameOrId) {
    return this.cfo.deleteStack({StackName: stackNameOrId}).promise()
  }

  async getStacks() { // array
    const sums = Object(await this.cfo.listStacks().promise().catch(e => throwWithMethod(`${this.m}.getStacks`))).StackSummaries
    /*
      {ResponseMetadata: { RequestId: '126cb8af-1769-11e8-a674-3b6924dcda09' },
      StackSummaries: [{
        StackId: 'arn:aws:cloudformation:us-west-2:038774786854:stack/c33/f5095520-1767-11e8-9d05-50d5ca789ee6',
        StackName: 'c33',
        TemplateDescription: 'Amazon CloudFormation template for EC2 instance\n',
        CreationTime: 2018-02-22T00:33:09.495Z,
        DeletionTime: 2018-02-22T00:33:14.976Z,
        StackStatus: 'ROLLBACK_COMPLETE'
      }]}
      */
     if (!Array.isArray(sums)) throw new Error(`${this.m}: bad AWS response for listStacks`)
    return sums
  }

  filterStacks(stacks) {
    const {stackName, stackId} = this
    return stacks.filter(({StackName: n, StackId: i}) =>
      (!stackName || stackName === n) && (!stackId || stackId === i))
  }

  ensureOneStack(stacks) {
    const no = stacks.length
    if (no !== 1) throw Object.assign(new Error(`${this.m} not exactly 1 stack matching: ${no}`), {no})
    const stack = stacks[0]
    const {StackName: stackName, StackId: stackId, StackStatus: stackStatus} = stack
    if (!stackId) {
      console.error(stacks)
      throw new Error(`${this.m} ensureOneStack assert`)
    }
    Object.assign(this, {stackName, stackId})
    return {stackName, stackId, stackStatus}
  }

  async getOneStack() {
    return this.ensureOneStack(this.filterStacks(await this.getStacks()))
  }

  async getStackNames() { // array of nestring
    const m = `${this.m} AWS listStack`
    return (await this.getStacks()).map(summary => {
      const {StackName, StackId, StackStatus} = summary || false
      let s = {}
      if (getNonEmptyString({StackName, s})) throw new Error(`${m}: bad stack name: ${s.text}`)
      if (getNonEmptyString({StackId, s})) throw new Error(`${m}: bad stack id: ${s.text}`)
      return {stackName: StackName, stackId: StackId, stackStatus: StackStatus}
    })
  }

  async getStackStatus() { // nestring or null
    const {stackName} = this
    for (let stack of await this.getStacks()) {
      const {StackName, StackStatus} = stack || false
      if (!StackName || typeof StackName !== 'string') throw new Error(`${this.m}: bad AWS StackName`)
      if (StackName === stackName) {
        if (!StackStatus || typeof StackStatus !== 'string') throw new Error(`${this.m}: bad AWS StackStatus`)
        return StackStatus
      }
    }
    return null
  }

  getRegion() {
   return Object(this.cfo.config).region // 'us-west-2'
  }
}
