/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import GeoFetcher from './GeoFetcher'
import RegionTypeState from './RegionTypeState'
import RegionTypeTZ from './RegionTypeTZ'

import micro, {send} from 'micro'

import urlMod from 'url'
import querystring from 'querystring'



export default class RegionsService {
  static sc404 = 'Not found'
  static defaultPath = '/regions'
  static defaultCount = 10
  static defaultDays = 30
  static defaultRegion = '<DEFAULT CLUSTERING>'
  static regionTypes = [new RegionTypeState, new RegionTypeTZ]
  static regionTypeNames = RegionsService.regionTypes.map(o => o.name)

  constructor(o = false) {
    this.path = o.path || RegionsService.defaultPath
    this.dataSource = o.dataSource || GeoFetcher
    this.server = micro(::this.r)
  }

  async r(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    const url = urlMod.parse(req.url)
    if (url.pathname !== this.path) return send(res, 404, `Unknown url: ${url.pathname} expected: ${this.path}`)
    // add Access-Control-Allow-Origin
    return new this.dataSource(this.getParameters(querystring.parse(url.query))).values()
  }

  getParameters({count = RegionsService.defaultCount, days = RegionsService.defaultDays , region_type = RegionsService.defaultRegion}) {
    if (!(count > 0)) throw new Error(`count parameter not positive number`)
    if (!(days > 0)) throw new Error(`days parameter not positive number`)
    const names = RegionsService.regionTypeNames
    const regionId = region_type === RegionsService.defaultRegion ? 0 : names.indexOf(region_type)
    if (!~regionId) throw new Error(`region_type unknown. have: ${names.join(',')}`)
    const regionType = RegionsService.regionTypes[regionId]
    return {count, days, regionType}
  }

  async listen(...args) {
    console.log('RegionsService.listen', ...args)
    this.server.listen(...args)
  }
}
