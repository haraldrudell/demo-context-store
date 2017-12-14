const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Apply+Promotion+API

function applyPromotion(couponCode) {
    let url = '/api/shopping-cart/basket/promotions';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ couponCode })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = applyPromotion;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/applyPromotion.js