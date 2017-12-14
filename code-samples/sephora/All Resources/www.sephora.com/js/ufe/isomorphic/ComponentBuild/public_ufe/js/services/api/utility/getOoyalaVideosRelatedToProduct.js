const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Ooyala+Content+API

function getOoyalaVideosRelatedToProduct(productId) {
    const url = '/api/util/ooyala?productId=' + productId;
    return refetch.fetch(restApi.getRestLocation(url)).
        then(data => data.errorCode ? Promise.reject(data) : data).
        then(({ content }) => content.items || []);
}


module.exports = getOoyalaVideosRelatedToProduct;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getOoyalaVideosRelatedToProduct.js