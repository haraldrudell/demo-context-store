const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Promotion+API

function removePromotion(orderId) {
    let url = '/api/shopping-cart/baskets/' + orderId + '/promotions';

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'DELETE',
        body: JSON.stringify({ orderId })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = removePromotion;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/removePromotion.js