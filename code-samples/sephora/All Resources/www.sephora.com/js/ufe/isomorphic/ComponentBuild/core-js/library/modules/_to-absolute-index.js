var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/library/modules/_to-absolute-index.js
// module id = 881
// module chunks = 1