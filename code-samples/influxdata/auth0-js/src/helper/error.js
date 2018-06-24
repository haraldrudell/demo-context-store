function buildResponse(error, description) {
  return {
    error: error,
    errorDescription: description
  };
}

function invalidJwt(description) {
  return buildResponse('invalid_token', description);
}

module.exports = {
  buildResponse: buildResponse,
  invalidJwt: invalidJwt
};



//////////////////
// WEBPACK FOOTER
// ./~/auth0-js/src/helper/error.js
// module id = 113
// module chunks = 0