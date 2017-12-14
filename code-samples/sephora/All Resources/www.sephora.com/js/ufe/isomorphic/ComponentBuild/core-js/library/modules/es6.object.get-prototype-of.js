// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});



//////////////////
// WEBPACK FOOTER
// ./~/core-js/library/modules/es6.object.get-prototype-of.js
// module id = 831
// module chunks = 1