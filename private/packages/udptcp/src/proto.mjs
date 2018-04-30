/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

export default { // Type: Root, nested property is required
  nested: {
    Packet: { // Type: Type, fields property required
      fields: {
        data: { // Type: Field, type and id properties required
          type: 'buffer', // types" https://github.com/dcodeIO/protobuf.js#valid-message
          id: 1, // id begins at 1
        }
      }
    }
  }
}
