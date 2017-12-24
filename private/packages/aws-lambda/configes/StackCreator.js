/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AWS from 'aws-sdk'
import fs from 'fs-extra'
import path from 'path'

const m = 'StackCreator'

export default class StackCreator {
  stackName = 'aws-lambda-starter-kit'
  s3BucketName = 'aws-lambda-starter-kit'

  async run(o = false) {
    if (o.stackName) this.stackName = o.stackName
    this.filename = o.filename || path.join(__dirname, 'cloudformation.yaml')
    const {stackName: stack} = this
    console.log(`Checking status of stack: ${stack}`)
    const stackStatus = await this.getStackStatus(stack)
    console.log(`${stack}: ${stackStatus}`)
    const letter = process.argv[process.argv.length - 1]
    if (letter ==='a') return
    if (letter ==='d') return this.doDelete(stack, stackStatus)

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
      case null: // the tak does not exist at all
        console.log(`Initiating create of ${stack}…`)
        const stackId = await this.createStack()
        console.log(`stack id: ${stackId}`)
      case 'CREATE_IN_PROGRESS':
        const t0 = Date.now()
        console.log(`waiting for: ${stack} [40 s] ${new Date(t0).toISOString()}`)      
        await this.waitWhile('CREATE_IN_PROGRESS')
        const duration = (Date.now() - t0) / 1e3
        console.log(`Done in ${duration.toFixed(1)} s! verifying…`)
        const newState = await this.getStackStatus(stack)
        if (newState !== 'CREATE_COMPLETE') throw new Error(`Unexpected state for stack ${stack}: ${newState}, expected CREATE_COMPLETE. Check CloudFormation Stacks Events on AWS Web site`)
        console.log(`${stack}: ${newState}`)
      case 'CREATE_COMPLETE':
        break
      default:
        throw new Error(`Unknown stack state for ${stack}: ${stackStatus}`)
    }
  }

  async doDelete(stack, stackStatus) {
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
        const newState = await this.getStackStatus(stack)
        if (newState !== 'DELETE_COMPLETE') throw new Error(`Unexpected state for stack ${stack}: ${newState}, expected DELETE_COMPLETE. Check CloudFormation Stacks Events on AWS Web site`)
        console.log(`${stack}: ${newState}`)
      case 'DELETE_COMPLETE':
      case null: // the tak does not exist at all
        break
      default:
        throw new Error(`Unknown stack state for ${stack}: ${stackStatus}`)
    }
  }
  async createStack() {
    const cf = this.getCf()
    const response = await cf.createStack({
      StackName: this.stackName,
      Capabilities: ['CAPABILITY_IAM'],
      TemplateBody: await fs.readFile(this.filename, 'utf8'),
      Parameters: [{
        ParameterKey: 'S3BucketName',
        ParameterValue: this.s3BucketName,
      }],
    }).promise()
    const stackId = Object(response).StackId
    if (!stackId || typeof stackId !== 'string') throw new Error(`${m}: bad response from aws createStack`)
    return stackId
  }

  async waitWhile(whileInState) { // 171222 hr: aws-sdk has waitFor but it hangs. This here is similar
    let timer
    for (;;) {
      const state = await this.getStackStatus(this.stackName)
      if (state !== whileInState) break
      await new Promise((resolve, reject) => setTimeout(resolve, 5e3))
    }
  }

  async deleteStack(stack) {
    const response = await this.getCf().deleteStack({StackName: this.stackName}).promise()
  }

  getCf = () => this.cf || (this.cf = this.instantiateCf())
  instantiateCf() {
    process.env.AWS_SDK_LOAD_CONFIG=1 // use: AWS_PROFILE ~/.aws/config ~/.aws/credentials
    return new AWS.CloudFormation() // service interface object
  }

  async getStackStatus(name) {
    const cf = this.getCf()
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
