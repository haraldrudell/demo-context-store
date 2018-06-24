function DummyStorage() {}

DummyStorage.prototype.getItem = function() {
  return null;
};

DummyStorage.prototype.removeItem = function() {};

DummyStorage.prototype.setItem = function() {};

module.exports = DummyStorage;



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/storage/dummy.js
// module id = 190
// module chunks = 0