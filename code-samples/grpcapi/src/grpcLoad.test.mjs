/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/grpcLoad.test.mjs
import {Root} from 'protobufjs'
import {load, Server, ServerCredentials, credentials} from 'grpc'

import path from 'path'
import util from 'util'

test('fromProto', () => {
  const socketAddress = '127.0.0.1:1234'
  const filename = 'route_guide.proto'

  // https://github.com/grpc/grpc/blob/v1.11.x/examples/node/dynamic_codegen/route_guide/route_guide_client.js
  const service = load(path.join(__dirname, filename))
  // console.log(service)
  /*{ routeguide:
       { Point:
          { [Function: Message]
            encode: [Function],
            decode: [Function],
            decodeDelimited: [Function],
            decode64: [Function],
            decodeHex: [Function],
            decodeJSON: [Function] },
         Rectangle:
          { [Function: Message]
            encode: [Function],
            decode: [Function],
            decodeDelimited: [Function],
            decode64: [Function],
            decodeHex: [Function],
            decodeJSON: [Function] },
         Feature:
          { [Function: Message]
            encode: [Function],
            decode: [Function],
            decodeDelimited: [Function],
            decode64: [Function],
            decodeHex: [Function],
            decodeJSON: [Function] },
         RouteNote:
          { [Function: Message]
            encode: [Function],
            decode: [Function],
            decodeDelimited: [Function],
            decode64: [Function],
            decodeHex: [Function],
            decodeJSON: [Function] },
         RouteSummary:
          { [Function: Message]
            encode: [Function],
            decode: [Function],
            decodeDelimited: [Function],
            decode64: [Function],
            decodeHex: [Function],
            decodeJSON: [Function] },
         RouteGuide: { [Function: ServiceClient] super_: [Function: Client], service: [Object] } } }
  */

  const json = Root.
  const routeguide = service.routeguide
  const client = new routeguide.RouteGuide(socketAddress, credentials.createInsecure())
  //console.log(client)
  /* ServiceClient { '$channel': Channel {} }
  */
 return

  // https://grpc.io/docs/tutorials/basic/node.html#starting-the-server
  const server = new Server()
  server.addProtoService(service)
  server.bind(socketAddress, ServerCredentials.createInsecure())

  expect(service).toBeTruthy()
  // console.log(`observable: ${util.inspect(observable.constructor.prototype, {colors: true})}`)
})
