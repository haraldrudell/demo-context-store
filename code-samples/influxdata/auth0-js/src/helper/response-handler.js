var error = require('./error');
var objectHelper = require('./object');

function wrapCallback(cb, options) {
  options = options || {};
  options.ignoreCasing = options.ignoreCasing ? options.ignoreCasing : false;

  return function(err, data) {
    var errObj;

    if (!err && !data) {
      return cb(error.buildResponse('generic_error', 'Something went wrong'));
    }

    if (!err && data.err) {
      err = data.err;
      data = null;
    }

    if (!err && data.error) {
      err = data;
      data = null;
    }

    if (err) {
      errObj = {
        original: err
      };

      if (err.response && err.response.statusCode) {
        errObj.statusCode = err.response.statusCode;
      }

      if (err.response && err.response.statusText) {
        errObj.statusText = err.response.statusText;
      }

      if (err.response && err.response.body) {
        err = err.response.body;
      }

      if (err.err) {
        err = err.err;
      }

      errObj.code = err.error || err.code || err.error_code || err.status || null;
      errObj.description =
        err.errorDescription ||
        err.error_description ||
        err.description ||
        err.error ||
        err.details ||
        err.err ||
        null;

      if (err.name) {
        errObj.name = err.name;
      }

      if (err.policy) {
        errObj.policy = err.policy;
      }

      return cb(errObj);
    }

    if (data.type && (data.type === 'text/html' || data.type === 'text/plain')) {
      return cb(null, data.text);
    }

    if (options.ignoreCasing) {
      return cb(null, data.body || data);
    }

    return cb(null, objectHelper.toCamelCase(data.body || data));
  };
}

module.exports = wrapCallback;



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/response-handler.js
// module id = 35
// module chunks = 0