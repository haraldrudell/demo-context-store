/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Network from '../lib/Network'

import * as allspawn from 'allspawn'

const {spawnCapture: spawnCapture0} = allspawn

test('Network.arping success should get response time', async () => {
  const response = [ // arping -c1 -Iwlp3s0 172.20.64.1
    'ARPING 172.20.64.1 from 172.20.68.189 wlp3s0',
    'Unicast reply from 172.20.64.1 [A0:36:9F:9A:9B:92]  25.583ms',
    'Sent 1 probes (1 broadcast(s))',
    'Received 1 response(s)',
  ].join('\n')
  const expected = 25.583

  const spy = jest.spyOn(allspawn, 'spawnCapture')
  function mockSpawnCapture(...args) {
    return {stdout: response}
  }
  spy.mockImplementation(mockSpawnCapture)

  const actual = await new Network().arping({iface: 1, ip: 2})

  expect(allspawn.spawnCapture).toHaveBeenCalled()
  expect(actual).toBe(expected)

  spy.mockReset()
  spy.mockRestore()
})

test('Network.arping no response should return false', async () => {
  const response = [ // arping -Ieth0 -c1 192.168.1.13
    'ARPING 192.168.1.13 from 192.168.1.10 eth0',
    'Sent 1 probes (1 broadcast(s))',
    'Received 0 response(s)',
  ].join('\n')
  const expected = false

  const spy = jest.spyOn(allspawn, 'spawnCapture')
  function mockSpawnCapture(...args) {
    return {stdout: response}
  }
  spy.mockImplementation(mockSpawnCapture)

  const actual = await new Network().arping({iface: 1, ip: 2})

  expect(allspawn.spawnCapture).toHaveBeenCalled()
  expect(actual).toBe(expected)

  spy.mockReset()
  spy.mockRestore()
})
