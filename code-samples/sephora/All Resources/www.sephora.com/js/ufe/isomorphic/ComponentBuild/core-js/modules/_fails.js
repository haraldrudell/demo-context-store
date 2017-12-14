module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};



//////////////////
// WEBPACK FOOTER
// ./~/core-js/modules/_fails.js
// module id = 18
// module chunks = 0