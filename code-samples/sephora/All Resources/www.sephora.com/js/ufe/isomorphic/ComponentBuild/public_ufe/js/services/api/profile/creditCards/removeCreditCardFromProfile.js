const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Credit+Card+from+Profile+API


function removeCreditCardFromProfile(userProfileId, creditCardId) {
    let url = `/api/users/profiles/${userProfileId}/creditCard/${creditCardId}`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'DELETE' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = removeCreditCardFromProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/creditCards/removeCreditCardFromProfile.js