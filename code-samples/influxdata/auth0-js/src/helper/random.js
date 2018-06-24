var windowHelper = require('./window');

function randomString(length) {
  // eslint-disable-next-line
  var bytes = new Uint8Array(length);
  var result = [];
  var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';

  var cryptoObj = windowHelper.getWindow().crypto || windowHelper.getWindow().msCrypto;
  if (!cryptoObj) {
    return null;
  }

  var random = cryptoObj.getRandomValues(bytes);

  for (var a = 0; a < random.length; a++) {
    result.push(charset[random[a] % charset.length]);
  }

  return result.join('');
}

module.exports = {
  randomString: randomString
};



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/random.js
// module id = 188
// module chunks = 0