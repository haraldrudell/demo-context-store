/* eslint-disable no-continue */

function get() {
  if (!Object.assign) {
    return objectAssignPolyfill;
  }

  return Object.assign;
}

function objectAssignPolyfill(target) {
  'use strict';
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

module.exports = {
  get: get,
  objectAssignPolyfill: objectAssignPolyfill
};



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/object-assign.js
// module id = 184
// module chunks = 0