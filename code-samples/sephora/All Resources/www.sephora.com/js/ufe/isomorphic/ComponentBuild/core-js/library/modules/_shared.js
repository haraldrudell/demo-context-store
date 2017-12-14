var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/library/modules/_shared.js
// module id = 837
// module chunks = 1