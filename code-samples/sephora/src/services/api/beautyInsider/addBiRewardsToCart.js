const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+BI+Rewards+to+Cart+API


function addBiRewardsToCart(skuId) {
    let url = '/api/bi/profile/rewards?includeBasket=true';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ biRewards: [skuId] })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addBiRewardsToCart;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/addBiRewardsToCart.js