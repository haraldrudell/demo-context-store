const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Cancel+Subscription+API


function cancelSubscription(profileId, subscriptionType) {
    const url = `/api/users/profiles/${profileId}/subscription/${subscriptionType}`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'DELETE' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = cancelSubscription;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/cancelSubscription.js