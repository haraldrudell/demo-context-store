/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

export function getTime(t) {
  if (!(t instanceof Date)) t = new Date()
  const text = t.toISOString()
  return `${text.substring(0, 10)} ${text.substring(11, 19)}${text.substring(23, 24)}`
}
