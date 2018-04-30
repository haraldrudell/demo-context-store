/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/dgram

import dgram from 'dgram'
import util from 'util'

console.log(`dgram exports: ${util.inspect(dgram, {colors: true})}`, Object.keys(dgram).length, Object.keys(dgram.Socket).length)
/*
Socket is a function with a super_ property

dgram exports: {
  _createSocketHandle: [Function: _createSocketHandle],
  createSocket: [Function: createSocket],
  Socket: {
    [Function: Socket]
    super_: {
      [Function: EventEmitter]
      EventEmitter: [Circular],
      usingDomains: false,
      defaultMaxListeners: [Getter/Setter],
      init: [Function],
      listenerCount: [Function]
} } }
*/
