var cookies = require('../cookies');

function CookieStorage() {}

CookieStorage.prototype.getItem = function(key) {
  return cookies.read(key);
};

CookieStorage.prototype.removeItem = function(key) {
  cookies.erase(key);
};

CookieStorage.prototype.setItem = function(key, value) {
  cookies.create(key, value, 1);
};

module.exports = CookieStorage;



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/storage/cookie.js
// module id = 189
// module chunks = 0