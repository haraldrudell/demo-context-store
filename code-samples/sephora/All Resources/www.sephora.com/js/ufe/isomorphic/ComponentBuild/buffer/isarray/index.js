var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};



//////////////////
// WEBPACK FOOTER
// ./~/buffer/~/isarray/index.js
// module id = 184
// module chunks = 0