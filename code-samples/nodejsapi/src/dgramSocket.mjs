/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/dgramSocket
// https://github.com/nodejs/node/blob/master/lib/dgram.js

import Tester from './Tester'

/*
socket.bind(port, [address], [callback])
socket.bind({port, [address]}, [callback])
- the socket does not listen until bind() is invoked
- a failed dns lookup on bind() emits an error on the Socket instance
- the 'listening' event (ie. the bind callback) is the only way to determine bind conclusion
- default address is all interfaces
- port must be provided, 0 means any port

dgram.Socket instance: Socket {
  _events: {},
  _eventsCount: 0,
  _maxListeners: undefined,
  _handle: UDP { lookup: [Function: bound lookup4], owner: [Circular] },
  _receiving: false,
  _bindState: 0,
  type: 'udp4',
  fd: null,
  _reuseAddr: undefined,
  emit: [Function],
  [Symbol(options symbol)]: {},
  [Symbol(asyncId)]: 12 }
instance methods: Socket {
  bind: [Function],
  sendto: [Function],
  send: [Function],
  close: [Function],
  address: [Function],
  setBroadcast: [Function],
  setTTL: [Function],
  setMulticastTTL: [Function],
  setMulticastLoopback: [Function],
  setMulticastInterface: [Function],
  addMembership: [Function],
  dropMembership: [Function],
  _healthCheck: [Function],
  _stopReceiving: [Function],
  ref: [Function],
  unref: [Function],
  setRecvBufferSize: [Function],
  setSendBufferSize: [Function],
  getRecvBufferSize: [Function],
  getSendBufferSize: [Function] }
*/

import util from 'util'

const cmd = 'dgramSocket'

run().catch(onRejected)

async function run() {
  let e
  await new Tester().test().catch(ee => e = ee)
  if (!e) console.log(`${cmd} completed successfully`)
  else failureExit(e, 'Tester.test failed')
}

function onRejected(e) { // unexpected error event
  failureExit(e, 'onRejected: Unexpected error outside of Tester.test')
}

function failureExit(e, message) {
  console.error(util.inspect(Object.assign(e, {[`${cmd}`]: message}), {colors: true}))
  process.exit(1)
}

