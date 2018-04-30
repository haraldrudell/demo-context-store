/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/GrpcSocket.test.mjs
import bufferService from './bufferService'
import GrpcSocket from './GrpcSocket'

import util from 'util'
//console.log(util.inspect(bufferService, {colors: true, depth: null}))
/*
{ nested:
  { PacketSink:
    { methods: { SendPacket: { requestType: 'Packet', responseType: 'Ok' } } },
    Packet: { fields: { data: { type: 'bytes', id: 1 } } },
    Ok: { fields: { bool: { type: 'bool', id: 1 } } } } }
*/

test('Can instantiate GrpcSocket', () => {
  const socketAddress = '127.0.0.1:1234'
  const grpcSocket = new GrpcSocket({socketAddress, proto: bufferService})
})

test('Can transfer message', async () => {
  const address = '127.0.0.1'
  const socketAddress = '127.0.0.1:1999'
  const messageFixture = 'abc'

  // proto data
  const serviceName = 'PacketSink'
  const implementationMap = {SendPacket}

  // instantiate server and client
  const grpcSocket = new GrpcSocket({socketAddress, proto: bufferService})
  const server = grpcSocket.startServer({serviceName, implementationMap})
  const client = grpcSocket.getClient(serviceName)

  // send message
  const value = {data: new Buffer(messageFixture)}
  const data = await new Promise((resolve, reject) => client.SendPacket(value, (e, d) => !e ? resolve(d) : reject(e)))
  // { bool: true }
  //console.log('SendPacket response, data:',util.inspect(data, {colors: true}))
  expect(data).toBeTruthy()
  expect(data.bool).toBe(true)

  // shutdown
  // unknown what the undocumented return value is
  // { try_shutdown: Server {} }
  await grpcSocket.shutdown()

  function SendPacket(call, callback) {
    // call is EventEmitter, name: serverUnaryCall
    // properties: cancelled: boolean, request: object, metadata, call: Call
    const value = call.request
    expect(value).toBeTruthy()
    expect(value.data).toBeInstanceOf(Buffer)
    const text = String(value.data)
    expect(text).toBe(messageFixture)
    //console.log('SendPacket request, data:', util.inspect(data, {colors: true}))

    // TODO fetch data from call
    // TODO set data in response
    /*
    SERVERCALL {
       ServerUnaryCall {
         _events: { error: [Function] },
         _eventsCount: 1,
         _maxListeners: undefined,
         call: Call {},
         cancelled: false,
         metadata: Metadata { _internal_repr: [Object] },
         request: { data: [] } },
function sendUnaryData(err, value, trailer, flags) {
          if (err) {
            if (trailer) {
              err.metadata = trailer;
            }
            handleError(call, err);
          } else {
            sendUnaryResponse(call, value, handler.serialize, trailer, flags);
          }
        }        */
    //console.log('SERVERCALL', args.length, ...args)

    callback(null, {bool: true}) // err, value[, trailer[, flags]] name: sendUnaryData
  }

  function _getSocketAddress(address, port) {
    return `${address}:${port}`
  }
})
