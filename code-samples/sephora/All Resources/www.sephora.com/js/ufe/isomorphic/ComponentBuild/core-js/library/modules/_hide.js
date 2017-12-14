var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/library/modules/_hide.js
// module id = 845
// module chunks = 1