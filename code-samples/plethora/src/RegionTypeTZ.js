/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class RegionTypeTZ {
  name = 'timezone'
  getRegion(o) {
    const tzs = o && o.properties && o.properties.tz
    const tz = Number(tzs)
    if (isNaN(tz)) throw new Error(`bad time zone: ${tzs}`)
    return `TZ ${tz}`
  }
}
