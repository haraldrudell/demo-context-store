const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Default+Credit+Card+on+Profile+API


function setDefaultCreditCardOnProfile(creditCardId) {
    let url = '/api/users/profiles/creditCards/defaultCreditCard';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({ creditCardId: creditCardId })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = setDefaultCreditCardOnProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/creditCards/setDefaultCreditCardOnProfile.js