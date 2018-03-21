/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AWS from 'aws-sdk'

const m = 'AwsInterface'

export default class AwsInterface {
  static CloudFormation = 'CloudFormation'
  static S3 = 'S3'
  _serviceInterfaceObjects = {}

  getService(service) {
    // verify argument
    const st = typeof service
    if (!service || st !== 'string') throw new Error(`${m} service not non-empty string: ${st}`)

    // check stored service interface objects
    const {_serviceInterfaceObjects: os} = this
    const sio = os[service]
    if (sio) return sio

    // instantiate
    if (typeof AWS[service] !== 'function') throw new Error(`${m} AWS service not in aws-sdk: ${service}`)
    process.env.AWS_SDK_LOAD_CONFIG=1 // use: AWS_PROFILE ~/.aws/config ~/.aws/credentials
    return os[service] = new AWS[service]() // service interface object
  }
}
