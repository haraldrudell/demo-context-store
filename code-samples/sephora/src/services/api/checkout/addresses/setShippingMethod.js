const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Shipping+Method+API

function setShippingMethod(shippingMethodData) {
    let url = '/api/checkout/orders/shippingGroups/shippingMethod';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(shippingMethodData)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = setShippingMethod;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/addresses/setShippingMethod.js