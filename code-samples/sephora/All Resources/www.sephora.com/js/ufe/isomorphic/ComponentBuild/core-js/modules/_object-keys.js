// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/modules/_object-keys.js
// module id = 28
// module chunks = 0