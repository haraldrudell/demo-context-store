/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import getDateStrings from './getDateStrings'

test('0:01 in local time zone has correct date', () => {
  const [year, month, date, zeroHour, oneMinute] = [2017, 10, 19, 0, 1]
  const t_00_01_Local_DateObject = new Date(year, month, date, zeroHour, oneMinute)
  const expected = {
    month6: // '201710'
      `${String(t_00_01_Local_DateObject.getFullYear()).padStart(4, '0')}` +
      `${String(t_00_01_Local_DateObject.getMonth() + 1).padStart(2, '0')}`,
    day6: // '171019'
    `${String(t_00_01_Local_DateObject.getFullYear() % 100).padStart(2, '0')}` +
    `${String(t_00_01_Local_DateObject.getMonth() + 1).padStart(2, '0')}` +
    `${String(t_00_01_Local_DateObject.getDate()).padStart(2, '0')}`,
  }
  const actual = getDateStrings(new Date(t_00_01_Local_DateObject))
  expect(actual).toEqual(expected)
})

test('23:59 in local time zone has correct date', () => {
  const [year, month, date, lastHour, lastMinute] = [2017, 10, 19, 23, 59]
  const t_23_59_Local_DateObject = new Date(year, month, date, lastHour, lastMinute)
  const expected = {
    month6: // '201710'
      `${String(t_23_59_Local_DateObject.getFullYear()).padStart(4, '0')}` +
      `${String(t_23_59_Local_DateObject.getMonth() + 1).padStart(2, '0')}`,
    day6: // '171019'
    `${String(t_23_59_Local_DateObject.getFullYear() % 100).padStart(2, '0')}` +
    `${String(t_23_59_Local_DateObject.getMonth() + 1).padStart(2, '0')}` +
    `${String(t_23_59_Local_DateObject.getDate()).padStart(2, '0')}`,
  }
  const actual = getDateStrings(new Date(t_23_59_Local_DateObject))
  expect(actual).toEqual(expected)
})

test('negative year throws', () => {
  const yearMinusOneDateObject = new Date(-1, 1, 1)
  expect(() => getDateStrings(yearMinusOneDateObject)).toThrow(/Invalid Date/)
})

test('year 10k throws', () => {
  const year10kDateObject = new Date(1e4, 1, 1)
  expect(() => getDateStrings(year10kDateObject)).toThrow(/Invalid Date/)
})

test('non-Date value throws', () => {
  const notDateObject = {}
  expect(() => getDateStrings(notDateObject)).toThrow(/not Date/)
})
