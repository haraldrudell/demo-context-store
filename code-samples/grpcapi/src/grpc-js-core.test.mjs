/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/grpc-js-core.test.mjs
import * as grpc from '@grpc/js-core'

import util from 'util'

test('Display @grpc/js-core exports', () => {
  console.log(`grpc exports: ${util.inspect(grpc, {colors: true, depth: null})}`)
  expect(grpc).toBeTruthy()
})

/*
    grpc exports: { CallCredentials:
       { createFromMetadataGenerator: [Function: createFromMetadataGenerator],
         createEmpty: [Function: createEmpty] },
      ChannelCredentials:
       { createSsl: [Function: createSsl],
         createInsecure: [Function: createInsecure] },
      Client: [Function: Client],
      Status:
       { '0': 'OK',
         '1': 'CANCELLED',
         '2': 'UNKNOWN',
         '3': 'INVALID_ARGUMENT',
         '4': 'DEADLINE_EXCEEDED',
         '5': 'NOT_FOUND',
         '6': 'ALREADY_EXISTS',
         '7': 'PERMISSION_DENIED',
         '8': 'RESOURCE_EXHAUSTED',
         '9': 'FAILED_PRECONDITION',
         '10': 'ABORTED',
         '11': 'OUT_OF_RANGE',
         '12': 'UNIMPLEMENTED',
         '13': 'INTERNAL',
         '14': 'UNAVAILABLE',
         '15': 'DATA_LOSS',
         '16': 'UNAUTHENTICATED',
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
      Metadata: { [Function: Metadata] fromHttp2Headers: [Function] } }
*/