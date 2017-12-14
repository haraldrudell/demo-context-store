'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPrefixedValue;
var regex = /-webkit-|-moz-|-ms-/;

function isPrefixedValue(value) {
  return typeof value === 'string' && regex.test(value);
}
module.exports = exports['default'];


//////////////////
// WEBPACK FOOTER
// ./~/css-in-js-utils/lib/isPrefixedValue.js
// module id = 129
// module chunks = 0