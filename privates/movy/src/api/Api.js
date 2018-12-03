/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import axios from 'axios'

export default class Api {
  static appJson = 'application/json'
  configuredAxios = axios.create({headers: {Accept: Api.appJson}})

  async issueRequest(endpoint) {
    const {appJson} = Api
    const {configuredAxios} = this
    const resp = await configuredAxios.get(endpoint)
    const contentType = String(resp.headers['content-type'] || '').toLowerCase()
    if (!contentType.includes(appJson)) throw new Error(`Bad server response content type: '${contentType}'`)
    return resp.data
  }
}
