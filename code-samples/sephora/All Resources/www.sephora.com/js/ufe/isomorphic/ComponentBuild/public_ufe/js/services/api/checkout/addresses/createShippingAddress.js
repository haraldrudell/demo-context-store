const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Create+Shipping+Address+API

function createShippingAddress(addressData) {
    let url = '/api/checkout/orders/shippingGroups/shippingAddress';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(addressData)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = createShippingAddress;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/addresses/createShippingAddress.js