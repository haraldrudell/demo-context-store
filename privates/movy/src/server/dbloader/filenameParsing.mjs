/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { toUTCDate } from '../util'

export function six_six(s) { // 20180413_194258.jpg
  const m = s.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})($|_|\.)/)
  //console.log('PARSE', s, m)
  if (!m) return

  // get pacific time
  let [year, month, day, hour, minute, second] = m.slice(1, 7)
  return toUTCDate({year, month, day, hour, minute, second})
}

const starts = ['IMG_', 'VID_']
export function img_six(s) {
  for (let start of starts) {
    if (!s.startsWith(start)) continue
    return six_six(s.substring(start.length))
  }
}

/*
const msPerHour = 1e3 * 60 * 60
const tvUTC2PST = -8 * msPerHour
const tvUTC2PDT = -7 * msPerHour
const hoursPerDay = 24
*/
export function timeval(s) { // '1382459867857' -> Oct 22 09:37:48 2013 / 2013-10-22 16:37:48Z
  const m = s.match(/^(\d{13})$/)
  if (!m) return
  const timeval = Number(m[1]) // UTC timestamp * 1e3
  if (!timeval > 0) return
  return new Date(timeval)
  /*
  // new Date will show 8 or 7 hours too late
  const localHour = Math.floor(timeval / msPerHour) % hoursPerDay
  const d = new Date(timeval)
  const dPst = new Date(timeval + tvUTC2PST)
  const dPdt = new Date(timeval + tvUTC2PDT)
  console.log('timeval', d.toISOString(), dPst.toISOString(), dPdt.toISOString(), localHour)
  throw new Error('NIMP')
  */
}

export function isovariant(s) { // 2011-04-27 08.31.29.jpg (pacific time)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2})\.(\d{2})\.(\d{2})$/)
  //console.log('PARSE', s, m)
  if (!m) return

  // get pacific time
  let [year, month, day, hour, minute, second] = m.slice(1, 7)
  return toUTCDate({year, month, day, hour, minute, second})
}
