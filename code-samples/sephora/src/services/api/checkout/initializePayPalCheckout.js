const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Initialize+PayPal+checkout+API


function initializePayPalCheckout(payload) {
    let url = '/api/checkout/paypal/init';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(payload)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = initializePayPalCheckout;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/initializePayPalCheckout.js