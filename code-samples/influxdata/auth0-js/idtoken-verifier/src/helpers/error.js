function ConfigurationError(message) {
  this.name = 'ConfigurationError';
  this.message = (message || '');
}
ConfigurationError.prototype = Error.prototype;

function TokenValidationError(message) {
  this.name = 'TokenValidationError';
  this.message = (message || '');
}
TokenValidationError.prototype = Error.prototype;

module.exports = {
  ConfigurationError: ConfigurationError,
  TokenValidationError: TokenValidationError
};



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/~/idtoken-verifier/src/helpers/error.js
// module id = 174
// module chunks = 0