/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import GeoFetcher from './GeoFetcher'

import micro from 'micro'

import urlMod from 'url'
import querystring from 'querystring'

export default class RegionsService {
  static sc404 = 'Not found'
  static defaultPath = '/regions'
  static defaultCount = 10
  static defaultDays = 30
  static defaultRegion = '<DEFAULT CLUSTERING>'

  constructor(o = false) {
    this.path = o.path || RegionsService.defaultPath
    this.dataSource = o.dataSource || new GeoFetcher()
    this.server = micro(::this.r)
  }

  async r(req, res) {
    const url = urlMod.parse(req.url)
    if (url.pathname !== this.path) return send(res, 404, RegionsService)
    return this.dataSource.get(this.getParameters(querystring.parse(url.query)))
  }

  getParameters({count = RegionsService.defaultCount, days = RegionsService.defaultDays , region_type = RegionsService.defaultRegion}) {
    if (!(count > 0)) throw new Error(`count parameter not positive number`)
    if (!(days > 0)) throw new Error(`days parameter not positive number`)
    return {count, days, region_type}
  }

  async listen() {
    console.log('RegionsService.listen')
    this.server.listen()
  }
}
