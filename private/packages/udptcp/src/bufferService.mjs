/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
https://github.com/dcodeIO/protobuf.js#using-json-descriptors
*/

export default { // Type: Root, required property: nested
  nested: { // top-level nested property: contains services and messages
    PacketSink: { // child property is methods, so this is a service
      methods: {
        SendPacket: {
          requestType: 'Packet',
          responseType: 'Ok',
        },
      },
    },
    Packet: { // child property is fields, so this is a message
      fields: { // fields property: parent is message
        data: { // Type: Field, type and id properties required
          type: 'bytes', // types" https://github.com/dcodeIO/protobuf.js#valid-message
          id: 1, // id begins at 1, must be non-negative integer
        },
      },
    },
    Ok: { // child property is fields, so this is a message
      fields: {
        bool: {
          type: 'bool',
          id: 1,
        },
      },
    },
  },
}
