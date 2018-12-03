/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { getTime as zuluGetTime } from 'server'

const msPerMin = 6e4
const minPerHour = 60

export function getTime(t) { // t Date in zulu
  if (!(t instanceof Date)) t = new Date()
  const offsMin = t.getTimezoneOffset() // pacific: 480
  return offsMin === 0
    ? zuluGetTime(t)
    : zuluGetTime(
      // for a positive offset, time is less than Zulu
      // to print time, subtract
      new Date(t.getTime() - offsMin * msPerMin),
      getTz(offsMin),
    )
}

function getTz(offsMin) { // translate getTimezoneOffset to '-08'
  // for a positive offset, timeZone has a minus
  const sign = offsMin > 0 ? '-' : '+'
  const posMinutes = Math.abs(offsMin)
  const minutesNum = posMinutes % minPerHour
  const minutes = minutesNum > 0 ? `:${twoDigits(minutesNum)}`: ''
  const hours = twoDigits(Math.floor(posMinutes / minPerHour))
  return `${sign}${hours}${minutes}`
}

function twoDigits(n) {
  const text = n.toFixed(0)
  return text.length < 2 ? `0${text}` : text
}
