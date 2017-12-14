const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Find+In+Store+API


/**
 * Find specific SKU in stores by some geo data.
 * @param skuId string  sku id of product
 * @param params object {zipCode, radius, latitude, longitude}
 * @returns {Promise}
 */
function findInStore(skuId, params = {}) {
    let url = `/api/catalog/skus/${skuId}/search?`;
    let queryParams = [];
    if (params.zipCode) {
        queryParams.push('zipCode=' + params.zipCode);
    }

    if (params.radius) {
        queryParams.push('radius=' + params.radius);
    }

    if (params.latitude && params.longitude) {
        queryParams.push('latitude=' + params.latitude);
        queryParams.push('longitude=' + params.longitude);
    }

    let apiUrl = url + queryParams.join('&');
    return refetch.fetch(restApi.getRestLocation(apiUrl), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = findInStore;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/findInStore.js