var storage = require('./storage');

module.exports = {
  set: function(connection, sub) {
    var ssodata = {
      lastUsedConnection: connection,
      lastUsedSub: sub
    };
    storage.setItem('auth0.ssodata', JSON.stringify(ssodata));
  },
  get: function() {
    var ssodata = storage.getItem('auth0.ssodata');
    if (!ssodata) {
      return;
    }
    return JSON.parse(ssodata);
  }
};



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/ssodata.js
// module id = 115
// module chunks = 0