/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
The goal is a data structure to provide to Server and Client contstructors
*/
import {Type, Field, Root} from 'protobuf'
const root = new Root()
  .define('package')
  .add(new Type('Packet').add(new Field('data', 1, 'bytes')))
  .add(new Type('Ok').add(new Field('bool', 1, 'bool')))

service: PacketSink
method: SendPacket, request Packet, response Ok
const AService = root.lookup('PacketSink')

// First, implement the RPC channel:
function rpc(method, requestData, callback) {
  // send requestData (binary) over the network
  ...
  // then call the callback with error, if any, and the received responseData (binary)
  callback(null, responseData);
}

// Create a runtime service:
var myService = MyService.create(/* your rpc implementation */ rpc, /* requestDelimited? */ true, /* responseDelimited? */ true);

// Call its methods (uses your RPC channel)
myService.MyMethod({ awesomeField: "awesomeText" }, function(err, responseMessage) {
   ...
});