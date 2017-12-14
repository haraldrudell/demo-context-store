const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+BI+Reward+from+Basket+API


function removeBiRewardFromBasket(orderId, skuId) {
    let url = '/api/bi/orders/' + orderId +
              '/rewards/' + skuId +
              '?includeBasket=true';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'DELETE'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = removeBiRewardFromBasket;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/removeBiRewardFromBasket.js