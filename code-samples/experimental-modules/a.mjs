// import built-in module
import fs from 'fs'
import * as fs2 from 'fs'

// import file system CJS
import cjs from './cjs.js'
import cjs2 from './cjs2.js'

// imports src/index.mjs, which must have a default export
import a from './src'
console.log('a:', a) // a: default:src/index.mjs

// import using a symlink
// ln -s ../src node_modules/fslink
import fslink from 'fslink'
console.log('fslink:', fslink) // fslink: default:src/index.mjs

// importing a built-in CJS module
console.log('typeof fs.readFileSync:', typeof fs.readFileSync) // function
console.log('typeof fs2.default.readFileSync:', typeof fs2.default.readFileSync) // function

// require is not defined
//const a = require('./src')

// extension must be provided, either .mjs or .js

// the import value from a CJS module
console.log('cjs:', cjs) // { a: [function: b] }
console.log('cjs2:', typeof cjs2, cjs2) // string cjs
