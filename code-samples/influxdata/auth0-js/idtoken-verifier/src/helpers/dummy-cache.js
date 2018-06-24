function DummyCache() {}

DummyCache.prototype.get = function () {
  return null;
};

DummyCache.prototype.has = function () {
  return false;
};

DummyCache.prototype.set = function () {
};

module.exports = DummyCache;



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/~/idtoken-verifier/src/helpers/dummy-cache.js
// module id = 173
// module chunks = 0