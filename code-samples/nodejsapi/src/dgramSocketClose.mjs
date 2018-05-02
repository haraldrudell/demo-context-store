/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/dgramSocketClose
// https://github.com/nodejs/node/blob/master/lib/dgram.js
import dgram from 'dgram'
const {Socket} = dgram

import util from 'util'

f().catch(e => console.error('f catch:', e))
async function f() {
  // constructor must be provided type
  const s = new Socket('udp4')
  s.emit0 = s.emit
  s.emit = (...args) => console.log(args[0]) + s.emit0(...args)
  // args -1, {}: TypeError [ERR_INVALID_ARG_TYPE]: The "hostname" argument must be one of type string or falsy. Received type object
  //await new Promise((resolve, reject) => s.bind(-1, {}, resolve))
  // failed lookup emits error on object
  console.log('before socket emit')
  await new Promise((resolve, reject) => {
    const socketListener = e => console.log('dnsfail Emit on object:', e) + cleanup()
    const callback = (...args) => console.log('dnsfail Callback:', ...args) + cleanup()
    s.once('error', socketListener).bind(-1, '%', callback)

    function cleanup() {
      s.removeListener('error', socketListener)
      resolve()
    }
  })
  //console.log(s)
  console.log('befoirefirst close')
  const c1 = await new Promise((resolve, reject) => {
    const socketListener = e => console.log('Emit on object:', e) + cleanup()
    const callback = (...args) => console.log('Callback:', ...args) + cleanup()
    s.once('error', socketListener)
    s.close((...args) => console.log('closeCb', ...args) + resolve())

    function cleanup() {
      s.removeListeners('error', socketListener)
      resolve()
    }
  })
  console.log('c1', c1)
  // second close: callback gets error
  let e2
  s.once('error', e => console.log('Socket.emit', e))
  console.log('close2:')
  const c2 = await new Promise((resolve, reject) => s.close(resolve)).catch(e => e2 = e)
  console.log('c2', c2, util.inspect(e2, {colors: true}), Object.keys(e2))
  // second close: Error [ERR_SOCKET_DGRAM_NOT_RUNNING]: Not running
  //console.log(s)
  //s.close()
}

console.log('endofscript')
