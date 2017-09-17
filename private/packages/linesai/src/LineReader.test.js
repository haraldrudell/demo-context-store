/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import LineReader from './LineReader'

import {Readable} from 'stream'

test('extend works', async () => {
  const lr = new LineReader(new Readable())
  expect(typeof lr.readLine).toEqual('function')
})

import LineReader5 from '../lib/LineReader'
test('extend works in transpiled', async () => {
  const lr = new LineReader(new Readable())
  expect(typeof lr.readLine).toEqual('function')
})
