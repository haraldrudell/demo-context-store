/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default {
  input: 'src/cleanbin', // input default extension is .js
  output: [{file: 'build/clean.js', format: 'cjs'}], // output must have extension
  external: ['fs-extra', 'path'], // imports and Node.js standard library needs to be excluded
}
