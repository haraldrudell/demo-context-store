const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Initiate+Anonymous+Checkout+API

function initializeAnonymousCheckout(payload) {
    let url = '/api/checkout/initAnonymousPurchase';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(payload)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = initializeAnonymousCheckout;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/initializeAnonymousCheckout.js