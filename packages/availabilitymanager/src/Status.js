/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class Status {
  getISOTime(timeval) {
    return getISOTime(timeval)
  }
}

export function getISOTime(timeval) {
  const tzAddMin = -new Date().getTimezoneOffset()
  const s = new Date(timeval + tzAddMin * 6e4).toISOString()
  const tzMin = Math.abs(tzAddMin)
  const tzString =
    `${tzAddMin < 0 ? '-' : '+'}` +
    `${tzMin < 600 ? '0' : ''}` +
    `${Math.floor(tzMin / 60)}` +
    `${tzMin % 60 > 0 ? Math.floor(tzMin % 60) : ''}`
  return `${s.substring(0, 10)} ${s.substring(11,19)}${tzString}`
}
