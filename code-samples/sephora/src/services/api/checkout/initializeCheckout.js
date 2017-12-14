const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Initialize+checkout+API

function initializeCheckout(payload) {
    let url = '/api/checkout/order/init';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(payload)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = initializeCheckout;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/initializeCheckout.js