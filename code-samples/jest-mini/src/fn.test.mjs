/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {fn} from './fn'

test('fn should return 2', () => {
  const expected = 2
  const actual = fn()
  expect(actual).toEqual(expected)
})
