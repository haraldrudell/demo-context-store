const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Auto+Login+API

function autoLogin() {
    return refetch.fetch(RestApi.getRestLocation('/api/ssi/autoLogin'), {
        method: 'POST',
        body: '{}'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = autoLogin;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/ssi/autoLogin.js