/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const m = 'getDateStrings'

// dateArg: year 0 to 9999 inclusive, return value: {month6: '201710', day6: '171019'}
export default function getDateStrings(dateArg = new Date()) {
  if (!(dateArg instanceof Date)) throw new Error('${m}: argument not Date')
  const fullYear = dateArg.getFullYear()
  if (isNaN(fullYear) || fullYear < 0 || fullYear >= 1e4) throw new Error(`${m}: Invalid Date: ${dateArg.toISOString()}`)
  const year4 = String(fullYear).padStart(4, '0')
  const year2 = String(fullYear % 100).padStart(2, '0')
  const month = String(dateArg.getMonth() + 1).padStart(2, '0')
  const dayOfMonth = String(dateArg.getDate()).padStart(2, '0')
  return {
    month6: `${year4}${month}`, // '201710'
    day6: `${year2}${month}${dayOfMonth}`, // '171019'
  }
}
