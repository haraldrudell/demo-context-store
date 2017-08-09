import {default as AsyncModerator, o} from './AsyncModerator'
import ApkCopier from './ApkCopier'

import fs from 'fs-extra'
import adb from 'adbkit'

export default class AndroidManager {
  async run() {
    const directory = this.directory = '/x/tostorage/devices/generic/apk'
    await fs.pathExists(directory)

    this.serialNumber = '4e536167'
    this.client = adb.createClient()

    const asyncModerator = new AsyncModerator(20)
    asyncModerator.promise.then(this.done).catch(this.errorHandler)
    asyncModerator.addAsyncIterator(new ApkCopier(this))
    asyncModerator.setAllSubmitted()
  }

  done = v => console.log('AndroidManager.done')

  errorHandler = e => {
    console.error('\nAndroidManager.errorHandler')
    process.nextTick(() => {throw e})
  }

}
