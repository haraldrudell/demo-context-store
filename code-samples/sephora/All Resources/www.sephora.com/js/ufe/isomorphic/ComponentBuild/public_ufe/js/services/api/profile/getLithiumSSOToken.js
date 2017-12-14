const refetch = require('Refetch').fetch;
const restApi = require('RestApi');

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Lithium+SSO+Token

function getLithiumSSOToken(profileId) {
    let url = `/api/users/profiles/${profileId}/lithiumSsoToken`;
    return refetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data.lithiumSsoToken);
}

module.exports = getLithiumSSOToken;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getLithiumSSOToken.js