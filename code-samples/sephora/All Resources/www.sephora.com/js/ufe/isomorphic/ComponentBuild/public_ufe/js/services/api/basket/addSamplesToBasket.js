const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Samples+to+Basket+API


function addSamplesToBasket(sampleSkuIdList) {
    let url = '/api/shopping-cart/basket/samples';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ sampleSkuIdList })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addSamplesToBasket;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/addSamplesToBasket.js