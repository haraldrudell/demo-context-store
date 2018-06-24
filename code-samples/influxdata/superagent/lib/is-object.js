'use strict';

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;



//////////////////
// WEBPACK FOOTER
// ./~/superagent/lib/is-object.js
// module id = 172
// module chunks = 0