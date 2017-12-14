const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Credit+Card+on+Profile+API


function updateCreditCardOnProfile(creditCardInfo) {
    return refetch.fetch(restApi.getRestLocation('/api/users/profiles/creditCard'), {
        method: 'PUT',
        body: JSON.stringify(creditCardInfo)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = updateCreditCardOnProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/creditCards/updateCreditCardOnProfile.js