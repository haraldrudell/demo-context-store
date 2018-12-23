/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// TODO move to package and transpile
// import babelJest from 'babel-jest'
const babelJest = require('babel-jest')

module.exports =
/*export default */ babelJest.createTransformer({
  babelrc: false,
  presets: [
    ['env', {targets:{node: '7'}}],
  ], plugins: [
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-async-generator-functions',
    'transform-runtime',
  ]})
