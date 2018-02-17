/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import pj from '../package.json'

import path from 'path'

test('can import build', () => {
  const main = Object(pj).main
  const mt = typeof main
  expect(main).toBeTruthy()
  expect(typeof main).toBe('string')
  const importValue = path.join('..', main)
  const o = require(importValue)
})
