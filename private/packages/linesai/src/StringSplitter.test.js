/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import StringSplitter from './StringSplitter'

test('Empty string immediately ends', async () => {
  const fetchValues = ['', false]
  let fetchInvocations = 0
  const fetch = () => {
    fetchInvocations++
    return fetchValues.shift()
  }

  const s = new StringSplitter(fetch)
  expect(await s.readLine()).toEqual(false)
  expect(s.hadFinalEOL()).toEqual(false)
  expect(fetchInvocations).toEqual(2)
})

test('hadFinalEOL', async () => {
  const fetchValues = ['a\n', false]
  let fetchInvocations = 0
  const fetch = () => {
    fetchInvocations++
    return fetchValues.shift()
  }

  const s = new StringSplitter(fetch)
  expect(await s.readLine()).toEqual('a')
  expect(await s.readLine()).toEqual(false)
  expect(s.hadFinalEOL()).toEqual(true)
  expect(fetchInvocations).toEqual(2)
})

test('crlf on data boundary, split into lines', async () => {
  const fetchValues = ['a\r', '\nb\n', false]
  let fetchInvocations = 0
  const fetch = () => {
    fetchInvocations++
    return fetchValues.shift()
  }

  const s = new StringSplitter(fetch)
  expect(await s.readLine()).toEqual('a')
  expect(await s.readLine()).toEqual('b')
  expect(await s.readLine()).toEqual(false)
  expect(s.hadFinalEOL()).toEqual(true)
  expect(fetchInvocations).toEqual(3)
})
