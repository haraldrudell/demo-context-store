var urljoin = require('url-join');
var PopupHandler = require('./popup-handler');

function PluginHandler(webAuth) {
  this.webAuth = webAuth;
}

PluginHandler.prototype.processParams = function (params) {
  params.redirectUri = urljoin('https://' + params.domain, 'mobile');
  delete params.owp;
  return params;
};

PluginHandler.prototype.getPopupHandler = function () {
  return new PopupHandler(this.webAuth);
};

module.exports = PluginHandler;



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/plugins/cordova/plugin-handler.js
// module id = 179
// module chunks = 0