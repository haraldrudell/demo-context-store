const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Reset+Password+API


function resetPasswordByLogin(login) {
    let url = '/api/secure/resetPassword';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ type: 'email', email: login })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = resetPasswordByLogin;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/authentication/resetPasswordByLogin.js