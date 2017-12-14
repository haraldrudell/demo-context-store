const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Subscription+Cancel+Reasons+API


function getSubscriptionCancelReasons() {
    const url = '/api/util/subscription/play/cancelReasons';
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data.cancelReasons);
}


module.exports = getSubscriptionCancelReasons;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getSubscriptionCancelReasons.js