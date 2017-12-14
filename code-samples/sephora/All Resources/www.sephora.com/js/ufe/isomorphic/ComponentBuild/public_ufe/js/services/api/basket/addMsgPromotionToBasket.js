const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+MSG+Promotion+to+Basket+API


function addMsgPromotionToBasket(couponCode, sampleSkuIdList) {
    let url = '/api/shopping-cart/basket/msgs';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ couponCode, sampleSkuIdList })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addMsgPromotionToBasket;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/addMsgPromotionToBasket.js