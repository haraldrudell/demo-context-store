/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
//import AWS from 'aws-sdk/../dist/aws-sdk.jsx'
//import AWS from 'aws-sdk/dist/aws-sdk.js'
import AWS from 'aws-sdk'
import IniParser from '@jedmao/ini-parser'
import fs from 'fs-extra'

//console.log('AWS require.resolve', require.resolve('aws-sdk'), AWS, window && window.AWS)

import os from 'os'
import path from 'path'

export default class AwsSdk {
  static awsCredentialsPath = path.join(os.homedir(), '.aws', 'credentials')
  static awsConfigPath = path.join(os.homedir(), '.aws', 'config')
  _serviceInterfaceObjects = {}

  constructor(o) {
    this.m = String(Object(o).name || 'AwsSdk')
  }

  getService(serviceName) {
    const st = typeof serviceName
    if (!serviceName || st !== 'string') throw new Error(`${this.m} service not non-empty string: ${st}`)

    // cached service interface objects
    const {_serviceInterfaceObjects: awsServices} = this
    const awsService = awsServices[serviceName]
    if (awsService) return awsService

    // instantiate
    const construct = AWS[serviceName]
    if (typeof construct !== 'function') {
      console.error(`Available AWS services: ${this.getServiceList({string: true})}`)
      throw new Error(`${this.m} service not in aws-sdk: ${serviceName}`)
    }
    // have constructor populate service.config.credentials service.config.region
    process.env.AWS_SDK_LOAD_CONFIG = 1 // use: AWS_PROFILE ~/.aws/config ~/.aws/credentials
    const service = awsServices[serviceName] = new construct() // service interface object
    if (!service.config.credentials) {
      const p = process.env.AWS_PROFILE
      const value = p !== undefined ? `'${p}'` : 'undefined'
      throw new Error(`${this.m} credentials missing: set AWS_PROFILE to one of: ${this.getProfilesSync().join(' ')}. AWS_PROFILE was: ${value}`)
    }
    if (!service.config.region) {
      const {profile} = service.config.credentials
      throw new Error(`${this.m} region not set in ~/.aws/config for profile: '${profile}`)
    }
    return service
  }

  hasCredentials() {
    return !!AWS.config.credentials
  }

  getProfilesSync() {
    const {awsCredentialsPath: file} = AwsSdk
    if (fs.pathExistsSync(file)) return this._parseProfiles(fs.readFileSync(file, 'utf8'))
  }

  async getProfiles() {
    const {awsCredentialsPath: file} = AwsSdk
    if (await fs.pathExists(file)) return this._parseProfiles(await fs.readFile(file, 'utf8'))
  }

  setRegion({region, profile, service}) {
    if (region === undefined && profile) {
      const {awsConfigPath: file} = AwsSdk
      if (fs.pathExistsSync(file)) {
        const data = new IniParser().parse(fs.readFileSync(file, 'utf8'))
        const key = `profile ${profile}`
        for (let section of data.items) {
          const {name, nodes} = section
          if (name === key) {
            for (let node of nodes) {
              if (node.key === 'region') {
                region = node.value
                break
              }
            }
          }
          if (region) break
        }
      }
    } else if (typeof region !== 'string') region = String(region)
    if (region !== undefined) {
      if (region === null) region = undefined
      if (!service) service = AWS
      //service.config.update({region}) // this fails b/c service CloudFormation domain is undefined
    }
  }

  getServiceList(o) {
    const {string} = o || false
    let services = []
    for (let [serviceName, fn] of Object.entries(Object(AWS))) if (typeof fn === 'function') services.push(serviceName)
    services = services.sort()
    return !string ? services : services.join(' ')
  }

  _parseProfiles(text) {
    const profiles = new Set()
    for (let section of new IniParser().parse(text).items) {
      const {name, nodes} = section
      name && nodes && nodes.length && profiles.add(name)
    }
    return Array.from(profiles).sort()
  }
}
