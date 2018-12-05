/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import * as moduleExports from '../lib/esm'

it('Exports ok', async () => {
  expect(typeof moduleExports).toBe('object')
  console.log(moduleExports)
})
