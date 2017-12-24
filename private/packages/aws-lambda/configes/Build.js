/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import spawn from 'spawn-async'

import AWS from 'aws-sdk'
import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'

const m = 'Build'

export default class Build {
  zipFile = path.resolve(path.join('build', 'FooFunction.zip'))
  srcDir = path.resolve('src')
  s3BucketName = 'aws-lambda-starter-kit'

  async run(o = false) {
    if (o.doBuild) await this.build()
    if (o.doDeploy) await this.deploy()
  }

  async build() {
    const {zipFile, srcDir} = this
    if (await fs.pathExists(zipFile)) await fs.remove(zipFile)
    const zipDir = path.join(zipFile, '..')
    if (!await fs.pathExists(zipDir)) await fs.ensureDir(zipDir)    
    return spawn({
      cmd: 'zip',
      args: ['-r', zipFile, '.',],
      options: {
        cwd: srcDir,
      }})
  }

  async deploy() {
    console.log('Deploying to S3…')
    const {s3BucketName, zipFile} = this
    const md5 = await this.checksumFile('md5', zipFile)
    const keys = [
      `FooFunction-${md5}.zip`,
      'FooFunction-latest.zip',
    ]
    const s3 = this.getS3()
    for (let key of keys) {
      console.log(`Uploading: ${key}`)
      await s3.upload({
        Bucket: s3BucketName,
        Body: fs.createReadStream(zipFile),
        Key: key,
      }).promise()
    }
  }

  getS3 = () => this.s3 || (this.s3 = this.instantiateS3())
  instantiateS3() {
    process.env.AWS_SDK_LOAD_CONFIG=1 // use: AWS_PROFILE ~/.aws/config ~/.aws/credentials
    return new AWS.S3() // service interface object
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
