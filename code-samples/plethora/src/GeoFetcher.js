/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class GeoFetcher {
  async get({count, days, region_type}) {
    console.log('GeoFetcher', count, days, region_type)
    return Promise.resolve({b: 2})
  }
}
