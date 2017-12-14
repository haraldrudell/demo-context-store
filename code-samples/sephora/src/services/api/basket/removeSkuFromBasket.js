const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+SKU+from+basket+API


function removeSkuFromBasket(orderId, skuId, modifyConfirmed) {
    let url = '/api/shopping-cart/baskets/' + orderId + '/items/' + skuId;

    if (modifyConfirmed) {
        url += '?modifyConfirmed=true';
    }

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'DELETE'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = removeSkuFromBasket;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/removeSkuFromBasket.js