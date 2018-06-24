/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
solution:
We do not want memcpy because it includes native C++ code
This package override of memcpy thereby removes the Rollup build error
At the same time, the Error thrown below indicates to bytebuffer that memcpy shiould not be used
- problem solved!

cause:
The project uses grpc
grpc imports protobufjs imports bytebuffer
bytebuffer/dist/bytebuffer-node.js probes for the memcpy package
Rollup therefore searches for the memcpy package
if memcpy is declared as external, an error is thrown on executable launch since memcpy will not be available
less ../../node_modules/bytebuffer/dist/bytebuffer-node.js
memcpy = null; try { memcpy = require("memcpy"); } catch (e) {}
the default export from memcpy should be falsy

symptom:
yarn build
{ code: 'UNRESOLVED_IMPORT',
  source: 'memcpy',
  importer: '../../node_modules/bytebuffer/dist/bytebuffer-node.js',
  message: '\'memcpy\' is imported by ../../node_modules/bytebuffer/dist/bytebuffer-node.js, but could not be resolved – treating it as an external dependency',
  url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency',
  toString: [Function] }
*/
// because bytebuffer uses the default export, Rollup requires it to exist
// bytebuffer ignores memcy if thge defaulot export is a falsy value
export default false