const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+BI+Account+API


function updateBiAccount(input) {
    const url = '/api/bi/account';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify(input)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = updateBiAccount;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/updateBiAccount.js