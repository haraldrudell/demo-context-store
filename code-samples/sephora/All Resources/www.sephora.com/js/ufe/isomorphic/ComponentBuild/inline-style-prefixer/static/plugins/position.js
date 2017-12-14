'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = position;
function position(property, value) {
  if (property === 'position' && value === 'sticky') {
    return ['-webkit-sticky', 'sticky'];
  }
}
module.exports = exports['default'];


//////////////////
// WEBPACK FOOTER
// ./~/inline-style-prefixer/static/plugins/position.js
// module id = 135
// module chunks = 0