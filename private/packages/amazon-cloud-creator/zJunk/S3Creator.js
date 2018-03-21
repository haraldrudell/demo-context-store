/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AWS from 'aws-sdk'
import fs from 'fs-extra'
import path from 'path'

const m = 'S3Creator'

export default class S3Creator extends StackCreator {
  async run() {
    const {s3BucketName: bucket} = this
    console.log(`Checking status of S3 bucket: ${bucket}`)
    const stackStatus = await this.getBucketStatus(bucket)
  }

  getS3 = () => this.s3 || (this.s3 = this.instantiateS3())
  instantiateS3() {
    process.env.AWS_SDK_LOAD_CONFIG=1 // use: AWS_PROFILE ~/.aws/config ~/.aws/credentials
    return new AWS.() // service interface object
  }
}
