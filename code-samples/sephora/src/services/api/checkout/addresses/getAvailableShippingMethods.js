const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Available+Shipping+Methods+API

function getAvailableShippingMethods(orderId, shippingGroupId) {
    let url = '/api/checkout/orders/' + orderId + '/shippingGroups/' +
            shippingGroupId + '/shippingMethods';
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getAvailableShippingMethods;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/addresses/getAvailableShippingMethods.js