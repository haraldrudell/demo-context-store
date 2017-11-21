/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fetch from 'node-fetch'

import fs from 'fs-extra'

// http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
export default class Fetcher {
  async get(pageNo) {
    if (pageNo === 0) return await fs.readFile(path.join(__dirname, '..', 'data', 'sampledata.json'), 'utf8')
    else throw new Error(`Fetcher.get only page 0 is implemented, page: ${pageNo}`)
  }
}
