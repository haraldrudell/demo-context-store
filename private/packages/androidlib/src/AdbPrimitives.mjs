/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {default as adbkit} from 'adbkit/lib/adb'
import fs from 'fs'

export default class AdbPrimitives {
  static sharedAdbClient
  static m = 'AdbPrimitives'
  static useSharedClient = true

  static getClient(useShared) { // cannot be async
    let result = useShared && AdbPrimitives.sharedAdbClient
    if (!result) {
      try {
        const timer = setTimeout(() => {
          throw new Error(`${AdbPrimitives.m} adb.createClient slower than 1 s`)
        }, 1e3)
        result = adbkit.createClient()
        clearTimeout(timer)
        if (useShared) AdbPrimitives.sharedAdbClient = result
      } catch (e) {
        console.error(`${AdbPrimitives.m}.getClient`)
        throw e
      }
    }
    return result
  }

  static async getSerials(client) {
    if (!client) client = AdbPrimitives.getClient(true)
    const result = []
    const timer = setTimeout(() => {
      throw new Error(`${AdbPrimitives.m} adb.listDevices slower than 1 s`)
    }, 1e3)
    const objectList = await client.listDevices().catch(e => {
      console.error(`${AdbPrimitives.m}.getSerials`)
      throw e
    })
    clearTimeout(timer)
    for (let o of objectList) result.push(o.id)
    return result
  }

  constructor(o) {
    const {client0, serial, name: m0} = o || false
    this.m = String(m0 || AdbPrimitives.m)
    const client = client0 || AdbPrimitives.getClient(AdbPrimitives.useSharedClient)
    const name = serial
    Object.assign(this, {client, serial, name})
  }

  async adbShell(cmd) {
    const {client, serial, name, m} = this
    return client.shell(serial, cmd).catch(onRejected)

    function onRejected(e) {
      console.error(`${m}.pull failed: ${name} ${cmd}`)
      throw e
    }
  }

  async adbPull(from, to) {
    const {client, serial, name, m} = this
    const pullTransfer = await client.pull(serial, from).catch(onRejected)
    return new Promise((resolve, reject) => pullTransfer
      .on('error', reject)
      .pipe(fs.createWriteStream(to))
      .on('error', reject)
      .once('finish', resolve)
    ).catch(onRejected)

    function onRejected(e) {
      console.error(`${m}.pull failed: ${name} ${from}`)
      throw e
    }
  }
}
