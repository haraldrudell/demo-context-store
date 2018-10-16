/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getJobs, createJob} from 'api/api'
import StoreSlice from 'loadindicator/StoreSlice'

export let instance

export default class JobsSlice extends StoreSlice {
  constructor({sliceName}) {
    super({sliceName, apiMethod: getJobs})
    instance = this
  }

  getActions = () => ({createJobAction: this.createJobAction})

  createJobAction = o => this._createJob(o).catch(console.error)

  async _createJob(createObject) {
    console.log('JobsSlice.createJob')
    const newJob = await createJob(createObject)
    console.log('JobsSlice.createJob result:', JSON.stringify(newJob))
    instance.addOne(undefined, newJob)
  }
}
