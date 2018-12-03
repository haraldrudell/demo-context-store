/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function getTime(t, tz) {
  if (!(t instanceof Date)) t = new Date()
  const text = t.toISOString()
  tz = tz ? tz : text.substring(23, 24)
  return `${text.substring(0, 10)} ${text.substring(11, 19)}${tz}`
}
