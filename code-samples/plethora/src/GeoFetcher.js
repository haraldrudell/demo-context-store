/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

import fs from 'fs-extra'

import path from 'path'

// http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

export default class GeoFetcher {
  constructor({count, days, regionType}) {
    const msPerDay = 1e3 * 3600 * 24
    const now = new Date()
    const todayUTC0000Timeval = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    const minTime = todayUTC0000Timeval - days * msPerDay
    Object.assign(this, {count, regionType, minTime})
  }

  async values() {
    const regionMap = {}

    // examine all records for the last: days
    // put in map of region buckets
    const it = this.getValue()
    const {minTime, regionType, count} = this
    //for await (const it of ) {
    let i = 0
    for (;;) {
      const {value, done} = await it.next()
      if (value) {
        i++
        //console.log('value', value)
        const {time, mag} = value.properties
        if (time < minTime) break
        const region = regionType.getRegion(value)
        if (!region) continue
        const r = regionMap[region]
        if (!r) regionMap[region] = {name: region, earthquake_count: 1, total_magnitude: 10**mag}
        else {
          r.earthquake_count++
          r.total_magnitude += 10**mag
        }
      }
      if (done) break
    }

    // sort highest magnitude first
    const list = Object.values(regionMap)
    console.log(`records: ${i} regions: ${list.length} count: ${count}`)
    list.sort((a, b) => {
      const aa = a.earthquake_count
      const bb = b.earthquake_count
      return aa < bb ? 1
        : aa > bb ? -1
        : 0
    })

    // return count items
    const listCount = list.slice(0, count)
    listCount.forEach(v => v.total_magnitude = Math.log10(v.total_magnitude))
    return listCount
  }

  async *getValue() { // this generator is to be modified to execute multiple api requests
    const data = this.data || (this.data = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'data', 'sampledata.json'), 'utf8')))
    const list = data.features
    for (let index = 0; index < list.length; index++) yield list[index]
  }
}
