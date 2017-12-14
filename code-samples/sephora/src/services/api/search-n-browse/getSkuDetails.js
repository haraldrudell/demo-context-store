const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+SKU+Detail+API

// (!) As of 8/29/2017 this seems to be unused.

function getSkuDetails(skuId) {
    let url = '/api/catalog/skus/' + skuId;

    return refetch.fetch(restApi.getRestLocation(url)).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getSkuDetails;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/getSkuDetails.js