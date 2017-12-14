const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Order+Details+API

function getOrderDetails(orderId) {
    let url = '/api/checkout/orders/' + orderId +
              '?includeShippingItems=true&includeProfileFlags=true';
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getOrderDetails;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/getOrderDetails.js