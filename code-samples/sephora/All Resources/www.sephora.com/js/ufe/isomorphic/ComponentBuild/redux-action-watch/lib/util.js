'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isImmutable = exports.isImmutable = function isImmutable(appState) {
  return typeof appState.get === 'function';
};

exports.default = {
  isImmutable: isImmutable
};


//////////////////
// WEBPACK FOOTER
// ./~/redux-action-watch/lib/util.js
// module id = 355
// module chunks = 0