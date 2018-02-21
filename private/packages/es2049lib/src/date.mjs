/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function getISOLocal(o) {
  const {timeval, withMs, noTz} = o || false
  const m = 'getISOLocal'
  if (!(timeval >= 0)) throw new Error(`${m}: timeval not number >= 0: ${typeof timeval}`)
  const tzAddMin = -new Date().getTimezoneOffset()
  const s = new Date(timeval + tzAddMin * 6e4).toISOString() // 2017-09-01T19:02:46.322Z
  const endIndex = !withMs ? 19 : 23
  const day = s.substring(0, 10) // 2017-09-01
  const time = s.substring(11, endIndex) // 19:02:46 [.322]
  let result = `${day} ${time}`

  const withTz = !noTz
  if (withTz) {
    const tzMin = Math.abs(tzAddMin)
    const tzString = // '-07'
      `${tzAddMin < 0 ? '-' : '+'}` +
      `${tzMin < 600 ? '0' : ''}` +
      `${Math.floor(tzMin / 60)}` +
      `${tzMin % 60 > 0 ? Math.floor(tzMin % 60) : ''}`
    result += tzString
  }

  return result
}
