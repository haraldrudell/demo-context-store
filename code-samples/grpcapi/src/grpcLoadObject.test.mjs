/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/grpcLoadObject.test.mjs
import proto from './proto'

import {loadObject, Server, ServerCredentials} from 'grpc'
import {Root} from 'protobufjs'

import util from 'util'

test('fromObject', () => {
  const socketAddress = '127.0.0.1:1234'
  // loadObject need an object with property root

  // console.log(util.inspect(proto, {colors: true, depth: null}))
  /*
  {
    nested: {
      AwesomeMessage: { fields: { awesomeField: { type: 'string', id: 1 } } } } }
  */

  // fromJSON need object {[options]}
  const root = Root.fromJSON(proto)
  // console.log(root)
  /*
Root {
      options: undefined,
      name: '',
      parent: null,
      resolved: false,
      comment: null,
      filename: null,
      nested:
       { AwesomeMessage:
          Type {
            options: undefined,
            name: 'AwesomeMessage',
            parent: [Circular],
            resolved: false,
            comment: null,
            filename: null,
            nested: undefined,
            _nestedArray: [],
            fields: [Object],
            oneofs: undefined,
            extensions: undefined,
            reserved: undefined,
            group: undefined,
            _fieldsById: null,
            _fieldsArray: null,
            _oneofsArray: null,
            _ctor: null } },
      _nestedArray: null,
      deferred: [],
      files: [],
      AwesomeMessage:
       Type {
         options: undefined,
         name: 'AwesomeMessage',
         parent: [Circular],
         resolved: false,
         comment: null,
         filename: null,
         nested: undefined,
         _nestedArray: [],
         fields: { awesomeField: [Field] },
         oneofs: undefined,
         extensions: undefined,
         reserved: undefined,
         group: undefined,
         _fieldsById: null,
         _fieldsArray: null,
         _oneofsArray: null,
         _ctor: null } }  */

  const service = loadObject(root)
  //console.log(service)
  /* { AwesomeMessage: {} }
  */

  // https://grpc.io/docs/tutorials/basic/node.html#starting-the-server
  const server = new Server()
  server.addProtoService(service)
  server.bind(socketAddress, ServerCredentials.createInsecure())

  expect(service).toBeTruthy()
  // console.log(`observable: ${util.inspect(observable.constructor.prototype, {colors: true})}`)
})
