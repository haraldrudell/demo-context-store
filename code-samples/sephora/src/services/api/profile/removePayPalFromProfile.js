const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+PayPal+from+Profile+API


function removePayPalFromProfile(userProfileId) {
    let url = `/api/users/profiles/${userProfileId}/paypal`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'DELETE' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = removePayPalFromProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/removePayPalFromProfile.js