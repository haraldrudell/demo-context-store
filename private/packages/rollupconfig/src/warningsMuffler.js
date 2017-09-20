/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const m = 'rollupconfig.warningsMuffler: muffled'
export default function rollupConfigWarningsMuffler(messageObject) {
  const {code, source, missing, message} = messageObject

  /*
  https://github.com/rollup/rollup/issues/794
  https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
  { code: 'THIS_IS_UNDEFINED',
    message: 'The \'this\' keyword is equivalent to \'undefined\' at the top level of an ES module, and has been rewritten',
    url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined',
    pos: 12,
    loc: { file: '/opt/foxyboy/sw/packages/syslogtcp/src/Syslog.js', line: 1, column: 12 },
    frame: '1: var _this = this;\n               ^\n2: \n3: /*',
    id: '/opt/foxyboy/sw/packages/syslogtcp/src/Syslog.js',
    toString: [Function] }
  */
  if (code === 'THIS_IS_UNDEFINED') {
    console.log(`${m} rollup issue 794`)
    return
  }

  // https://github.com/rollup/rollup-plugin-babel/issues/13
  if (code === 'UNRESOLVED_IMPORT' && source.startsWith('babel-runtime/')) {
    console.log(`${m} babel issue 13`)
    return
  }

  /*
  https://github.com/rollup/rollup/issues/1408
  { code: 'MISSING_EXPORT',
    missing: 'default',
    importer: '\u0000commonjs-proxy:/opt/foxyboy/sw/private/node_modules/core-js/library/modules/es6.object.to-string.js',
    exporter: '../../node_modules/core-js/library/modules/es6.object.to-string.js',
    message: '\'default\' is not exported by \'../../node_modules/core-js/library/modules/es6.object.to-string.js\'',
    url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module',
    pos: 185,
    loc:
    { file: '\u0000commonjs-proxy:/opt/foxyboy/sw/private/node_modules/core-js/library/modules/es6.object.to-string.js',
      line: 1,
    column: 185 },
  */
  if (code === 'MISSING_EXPORT' && missing === 'default' && message.endsWith('es6.object.to-string.js\'')) {
    console.log(`${m} rollup issue 1408`)
    return
  }

  console.error(messageObject)
}
