const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Create+BI+Account+API


function createBiAccount(input) {
    const url = '/api/bi/account';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(input)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = createBiAccount;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/createBiAccount.js