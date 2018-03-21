/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AwsInterface from './AwsInterface'

import spawn from 'spawn-async'

import fs from 'fs-extra'
import crypto from 'crypto'

export default class S3Deployer extends AwsInterface {
  async deploy(o = false) {
    console.log('Deploying to S3…')
    const {privateS3BucketName, zipFile, functionName} = o
    const md5 = await this.checksumFile('md5', zipFile)
    const keys = [
      `${functionName}-${md5}.zip`,
      `${functionName}-latest.zip`,
    ]

    const s3 = this.getService(AwsInterface.S3)
    const promises = []
    for (let key of keys) {
      console.log(`Uploading: ${key}`)
      promises.push(s3.upload({
        Bucket: privateS3BucketName,
        Body: fs.createReadStream(zipFile),
        Key: key,
      }).promise())
    }
    return Promise.all(promises)
  }

  checksumFile(algorithm, path) {
    return new Promise((resolve, reject) =>
      fs.createReadStream(path)
        .on('error', reject)
        .pipe(crypto.createHash(algorithm)
          .setEncoding('hex'))
        .on('finish', function () {
          resolve(this.read())
        })
    )
  }
}
