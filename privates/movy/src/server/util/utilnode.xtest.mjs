/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { toUTCDate } from './utilnode'

{
  const input = {year: '2018', month: '01', day: '01', hour: '12', minute: '00', second: '00'}
  const expected = '2018-01-01T20:00:00.000Z'
  const t = 'TEST1'
  const a = toUTCDate(input)
  const actual = a && a.toISOString() || a
  const ok = actual === expected
  if (ok) console.log(`${t} ok`)
  else console.log(t, 'FAIL', actual, input)
}

{
  const input = {year: '2018', month: '06', day: '01', hour: '12', minute: '00', second: '00'}
  const expected = '2018-06-01T19:00:00.000Z'
  const a = toUTCDate(input)
  const actual = a && a.toISOString() || a
  const ok = actual === expected
  const t = 'TEST2'
  if (ok) console.log(`${t} ok`)
  else console.log(t, 'FAIL', actual, input)
}

{
  const input = {year: '2018', month: '06', day: '01', hour: '12', minute: '00', second: '00', tz: 'abc'}
  const expected = undefined
  const actual = toUTCDate(input)
  const ok = actual === expected
  const t = 'TEST3'
  if (ok) console.log(`${t} ok`)
  else console.log(t, 'FAIL', actual, input)
}
