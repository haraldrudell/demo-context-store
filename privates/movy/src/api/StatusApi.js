/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import FilesApi from './FilesApi'

export default class StatusApi extends FilesApi {
  static statusEndpoint = '/api/status'

  async getStatus() {
    const {statusEndpoint: endpoint} = StatusApi
    const p = await this.issueRequest(endpoint)
    return String(p.status || '')
  }
}
