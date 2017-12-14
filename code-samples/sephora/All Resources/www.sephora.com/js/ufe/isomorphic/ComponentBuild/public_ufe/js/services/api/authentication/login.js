const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Login+API


function login(log1n, password, options) {
    let { loginForCheckout, isKeepSignedIn } = options;

    let url = '/api/auth/login';

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({
            login: log1n,
            password,
            loginForCheckout,
            isKeepSignedIn
        })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = login;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/authentication/login.js