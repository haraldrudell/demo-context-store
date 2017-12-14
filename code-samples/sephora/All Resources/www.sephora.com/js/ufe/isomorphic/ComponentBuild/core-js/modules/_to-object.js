// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/modules/_to-object.js
// module id = 43
// module chunks = 0