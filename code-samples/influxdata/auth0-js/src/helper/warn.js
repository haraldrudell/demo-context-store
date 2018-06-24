/* eslint-disable no-console */

function Warn(options) {
  this.disableWarnings = options.disableWarnings;
}

Warn.prototype.warning = function(message) {
  if (this.disableWarnings) {
    return;
  }

  console.warn(message);
};

module.exports = Warn;



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/warn.js
// module id = 36
// module chunks = 0