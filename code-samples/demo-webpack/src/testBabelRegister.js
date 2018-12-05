/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
console.log('src/testBabelRegister.js: requiring @babel/register')
require('@babel/register')
console.log('src/testBabelRegister.js: requiring ./usesImport')
const usesImport = require ('./usesImport')

console.log('imported usesImport:', usesImport)

console.log('src/testBabelRegister.js: executing usesImport')
usesImport.default()
