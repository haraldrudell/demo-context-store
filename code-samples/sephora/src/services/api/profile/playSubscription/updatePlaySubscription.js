const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+PLAY+Subscription+API


function updatePlaySubscription(orderId) {
    const url = '/api/users/profiles/playSubscription';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({ orderId: orderId })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = updatePlaySubscription;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/playSubscription/updatePlaySubscription.js