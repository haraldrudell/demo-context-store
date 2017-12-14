const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Credit+Card+to+Profile+API


function addCreditCardToProfile(creditCardInfo) {
    return refetch.fetch(restApi.getRestLocation('/api/users/profiles/creditCard'), {
        method: 'POST',
        body: JSON.stringify(creditCardInfo)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addCreditCardToProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/creditCards/addCreditCardToProfile.js