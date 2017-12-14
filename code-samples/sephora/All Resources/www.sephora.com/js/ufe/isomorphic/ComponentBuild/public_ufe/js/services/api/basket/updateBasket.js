const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Basket+API


function updateBasket({ orderId, skuList, modifyConfirmed }) {
    let url = '/api/shopping-cart/basket/items';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({
            orderId,
            skuList,
            modifyConfirmed: !!modifyConfirmed
        })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = updateBasket;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/updateBasket.js