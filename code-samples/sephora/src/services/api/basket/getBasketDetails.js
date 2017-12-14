const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Basket+Details+API


function getBasketDetails() {
    let url = '/api/shopping-cart/basket';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getBasketDetails;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/getBasketDetails.js