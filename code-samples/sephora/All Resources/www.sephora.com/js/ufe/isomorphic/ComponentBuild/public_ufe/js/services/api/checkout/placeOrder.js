const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Place+Order+API

function placeOrder(params) {
    let url = '/api/checkout/submitOrder';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = placeOrder;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/placeOrder.js