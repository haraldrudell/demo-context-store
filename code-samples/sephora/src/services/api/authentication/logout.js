const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Logout+API


function logout() {
    let url = '/api/auth/logout';

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = logout;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/authentication/logout.js