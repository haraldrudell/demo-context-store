/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
export default class Cache extends Fetcher {
  constructor() {
    super()
    this.cache = {}
  }

  async * get

  async getPage(page) {
    const cache = this.cache

    let p = cache(pageNo)
    if (p) {
      // TODO expiry
      return p
    }

    console.log('GeoFetcher', count, days, regionType)
    return Promise.resolve({b: 2})
  }
}
