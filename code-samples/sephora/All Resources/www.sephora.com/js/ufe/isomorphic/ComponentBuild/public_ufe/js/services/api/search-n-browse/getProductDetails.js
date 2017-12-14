const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Product+Details+API

function addCurrentSkuToProductChildSkus(productData) {
    let {
        regularChildSkus = [],
        onSaleChildSkus = [],
        currentSku = {}
    } = productData;

    if (currentSku.salePrice) {
        if (!onSaleChildSkus.filter(
                sku => sku.skuId === currentSku.skuId).length) {
            onSaleChildSkus.unshift(currentSku);
        }
    } else {
        if (!regularChildSkus.filter(
                sku => sku.skuId === currentSku.skuId).length) {
            regularChildSkus.unshift(currentSku);
        }
    }

    productData.regularChildSkus = regularChildSkus;
    productData.onSaleChildSkus = onSaleChildSkus;
    return productData;
}

function getProductDetails(productId, skuId = null, options = {}) {
    let url = restApi.getRestLocation('/api/catalog/products/');
    let opts = Object.assign({}, options);

    if (skuId) {
        url += productId + '?preferedSku=' + skuId + '&includeConfigurableSku=true';
    } else {
        url += productId;
    }

    return refetch.fetch(url).
        then(data => data.errorCode ? Promise.reject(data) : (() => {
            let promise;

            if (opts.addCurrentSkuToProductChildSkus) {
                promise = Promise.resolve(addCurrentSkuToProductChildSkus(data));
            } else {
                promise = Promise.resolve(data);
            }

            return promise;
        })());
}


module.exports = getProductDetails;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/getProductDetails.js