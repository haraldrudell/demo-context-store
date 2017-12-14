const refetch = require('Refetch').fetch;
const restApi = require('RestApi');

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+User-Specific+Product+Details+API

function getUserSpecificProductDetails(productId, skuId = null) {
    let url = `/api/users/profiles/current/product/${productId}?`;
    let queryParams = [];
    queryParams.push('skipAddToRecentlyViewed=false');

    if (skuId !== null) {
        queryParams.push(`preferedSku=${skuId}`);
    }

    url = url + queryParams.join('&');

    return refetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).
        then(data => data.errorCode ? Promise.reject(data) : data).
        catch(reason => {
            console.error(
                    'getUserSpecificProductDetails failed for ' +
                    `productId, skuId: ${productId}, ${skuId}.`);
            return Promise.reject(reason);
        });
}

module.exports = getUserSpecificProductDetails;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getUserSpecificProductDetails.js