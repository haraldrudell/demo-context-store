var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/modules/core.get-iterator-method.js
// module id = 68
// module chunks = 0