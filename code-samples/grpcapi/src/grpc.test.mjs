/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/grpc.test.mjs
import * as grpc from 'grpc'

import util from 'util'

test('Display rxjs exports', () => {
  console.log(`grpc exports: ${util.inspect(grpc, {colors: true})}`)
  expect(grpc).toBeTruthy()
})

/*
grpc exports: {
  loadObject: [Function: loadObject],
  load: [Function: load],
  setLogger: [Function: setLogger],
  setLogVerbosity: [Function: setLogVerbosity],
  Server: [Function: Server],
  Metadata: { [Function: Metadata] _fromCoreRepresentation: [Function] },
  status: {
    OK: 0,
    CANCELLED: 1,
    UNKNOWN: 2,
    INVALID_ARGUMENT: 3,
    DEADLINE_EXCEEDED: 4,
    NOT_FOUND: 5,
    ALREADY_EXISTS: 6,
    PERMISSION_DENIED: 7,
    RESOURCE_EXHAUSTED: 8,
    FAILED_PRECONDITION: 9,
    ABORTED: 10,
    OUT_OF_RANGE: 11,
    UNIMPLEMENTED: 12,
    INTERNAL: 13,
    UNAVAILABLE: 14,
    DATA_LOSS: 15,
    UNAUTHENTICATED: 16 },
  propagate: {
    DEADLINE: 1,
    CENSUS_STATS_CONTEXT: 2,
    CENSUS_TRACING_CONTEXT: 4,
    CANCELLATION: 8,
    DEFAULTS: 65535 },
  callError: {
    OK: 0,
    ERROR: 1,
    NOT_ON_SERVER: 2,
    NOT_ON_CLIENT: 3,
    ALREADY_INVOKED: 5,
    NOT_INVOKED: 6,
    ALREADY_FINISHED: 7,
    TOO_MANY_OPERATIONS: 8,
    INVALID_FLAGS: 9,
    INVALID_METADATA: 10,
    INVALID_MESSAGE: 11,
    NOT_SERVER_COMPLETION_QUEUE: 12,
    BATCH_TOO_BIG: 13,
    PAYLOAD_TYPE_MISMATCH: 14 },
  writeFlags: { BUFFER_HINT: 1, NO_COMPRESS: 2 },
  logVerbosity: { DEBUG: 0, INFO: 1, ERROR: 2 },
  credentials: {
    createSsl: [Function],
    createFromMetadataGenerator: [Function],
    createFromGoogleCredential: [Function],
    combineChannelCredentials: [Function],
    combineCallCredentials: [Function],
    createInsecure: [Function] },
  ServerCredentials: { [Function: ServerCredentials] createSsl: [Function], createInsecure: [Function] },
  makeGenericClientConstructor: [Function],
  getClientChannel: [Function],
  waitForClientReady: [Function],
  closeClient: [Function: closeClient],
  Client: [Function: Client],
  default: {
    loadObject: [Function: loadObject],
    load: [Function: load],
    setLogger: [Function: setLogger],
    setLogVerbosity: [Function: setLogVerbosity],
    Server: [Function: Server],
    Metadata: { [Function: Metadata] _fromCoreRepresentation: [Function] },
    status: {
      OK: 0,
      CANCELLED: 1,
      UNKNOWN: 2,
      INVALID_ARGUMENT: 3,
      DEADLINE_EXCEEDED: 4,
      NOT_FOUND: 5,
      ALREADY_EXISTS: 6,
      PERMISSION_DENIED: 7,
      RESOURCE_EXHAUSTED: 8,
      FAILED_PRECONDITION: 9,
      ABORTED: 10,
      OUT_OF_RANGE: 11,
      UNIMPLEMENTED: 12,
      INTERNAL: 13,
      UNAVAILABLE: 14,
      DATA_LOSS: 15,
      UNAUTHENTICATED: 16 },
    propagate: {
      DEADLINE: 1,
      CENSUS_STATS_CONTEXT: 2,
      CENSUS_TRACING_CONTEXT: 4,
      CANCELLATION: 8,
      DEFAULTS: 65535 },
    callError: {
      OK: 0,
      ERROR: 1,
      NOT_ON_SERVER: 2,
      NOT_ON_CLIENT: 3,
      ALREADY_INVOKED: 5,
      NOT_INVOKED: 6,
      ALREADY_FINISHED: 7,
      TOO_MANY_OPERATIONS: 8,
      INVALID_FLAGS: 9,
      INVALID_METADATA: 10,
      INVALID_MESSAGE: 11,
      NOT_SERVER_COMPLETION_QUEUE: 12,
      BATCH_TOO_BIG: 13,
      PAYLOAD_TYPE_MISMATCH: 14 },
    writeFlags: { BUFFER_HINT: 1, NO_COMPRESS: 2 },
    logVerbosity: { DEBUG: 0, INFO: 1, ERROR: 2 },
    credentials: {
      createSsl: [Function],
      createFromMetadataGenerator: [Function],
      createFromGoogleCredential: [Function],
      combineChannelCredentials: [Function],
      combineCallCredentials: [Function],
      createInsecure: [Function] },
    ServerCredentials: { [Function: ServerCredentials] createSsl: [Function], createInsecure: [Function] },
    makeGenericClientConstructor: [Function],
    getClientChannel: [Function],
    waitForClientReady: [Function],
    closeClient: [Function: closeClient],
    Client: [Function: Client]
} }
*/