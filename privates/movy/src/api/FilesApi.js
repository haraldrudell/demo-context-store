/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Api from './Api'

export default class FilesApi extends Api {
  static states = {
    NONE: 'NONE',
    DONE: 'DONE',
  }
  static filesEndpoint = '/api/files'
  state = FilesApi.states.NONE

  async load() {
    const {state} = this
    const {filesEndpoint: endpoint, states: {DONE}} = FilesApi
    const isPromise = state instanceof Promise
    if (!isPromise && state !== DONE) {
      const p = this.state = this.issueRequest(endpoint).catch(e => e)
      let t = await p
      if (!(t instanceof Error)) t = await this.processResponse(t).catch(e => e)
      //console.log('load result:', t)

      if (!(t instanceof Error)) {
        this.state = DONE
        return this.data = t
      } else {
        this.state = t
        throw t
      }
    } else if (isPromise) return state
    else return this.data
  }

  async processResponse(data) {
    const {files} = Object(data)
    if (!Array.isArray(files)) throw new Error('Response files property not array')
    files.forEach((f, i) => {
      if (!f || typeof f !== 'string') throw new Error(`files item ${i + 1}: not non-empty string`)
    })
    return files
  }
}
