const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+to+Cart+API


function addToCart({ orderId, skuList }) {
    let url = '/api/shopping-cart/basket/items';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ orderId, skuList })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addToCart;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/addToCart.js