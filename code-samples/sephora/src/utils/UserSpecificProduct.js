/**
 * Returns a map of all skuId->sku for all skus in a product.  This ibcludes all sku groups,
 * such as ymalSkus, ancillarySkus, etc...
 *
 * @param userSpecificProductDetails
 * @returns {Map}
 */
let buildMapOfUserSpecificSkuDetails = function(userSpecificProductDetails = {}) {
    let safelySet = function (skuMap, id, newValue) {
        let oldValue = skuMap.get(id);
        skuMap.set(id, Object.assign({}, oldValue, newValue));
    };
    let {
        regularChildSkus = [],
        onSaleChildSkus = [],
        simillarSkus = [],
        ymalSkus = [],
        ancillarySkus = [],
        recentlyViewedSkus = []
    } = userSpecificProductDetails;

    let skuMap = new Map();

    if (userSpecificProductDetails.currentSku) {
        safelySet(skuMap, userSpecificProductDetails.currentSku.skuId,
            userSpecificProductDetails.currentSku);
    }

    regularChildSkus.forEach((skuDetails) => {
        safelySet(skuMap, skuDetails.skuId, skuDetails);
    });

    onSaleChildSkus.forEach((skuDetails) => {
        safelySet(skuMap, skuDetails.skuId, skuDetails);
    });

    simillarSkus.forEach((skuDetails) => {
        safelySet(skuMap, skuDetails.skuId, skuDetails);
    });

    ymalSkus.forEach((skuDetails) => {
        safelySet(skuMap, skuDetails.skuId, skuDetails);
    });

    ancillarySkus.forEach((skuDetails) => {
        safelySet(skuMap, skuDetails.skuId, skuDetails);
    });

    recentlyViewedSkus.forEach((skuDetails) => {
        safelySet(skuMap, skuDetails.skuId, skuDetails);
    });

    return skuMap;
};

/**
 * This copies only to a single level.  It does not deep copy within skus, for example
 *
 * This is necessary because our product store data is not normalized
 *
 * @param product
 */
let deepCopyProduct = function(product) {
    let {
        regularChildSkus = [],
        onSaleChildSkus = [],
        simillarSkus = [],
        ymalSkus = [],
        ancillarySkus = [],
        recentlyViewedSkus = []
    } = product;

    let newProduct = Object.assign({}, product);
    newProduct.currentSku = Object.assign({}, product.currentSku);

    newProduct.regularChildSkus = regularChildSkus.slice();
    newProduct.onSaleChildSkus = onSaleChildSkus.slice();
    newProduct.simillarSkus = simillarSkus.slice();
    newProduct.ymalSkus = ymalSkus.slice();
    newProduct.ancillarySkus = ancillarySkus.slice();
    newProduct.recentlyViewedSkus = recentlyViewedSkus.slice();

    return newProduct;

};

let UserSpecificProductUtil = {
    // This method adds User specific details to currentProduct Object
    // for example currentSku, regularChildSkus, onSaleChildSkus, simillarSkus, ymalSkus
    // ancillarySkus and recentlyViewedSkus because this information will be pulled
    // for each user after initial cached product common information is loaded in ctrlr
    addUserSpecificDetailsToProduct: function(product, userSpecificProductDetails = {}) {

        let userSpecificProduct = deepCopyProduct(product);

        // If we have user-specific data, flag the product as ready
        if (Object.keys(userSpecificProductDetails).length !== 0) {
            userSpecificProduct.isUserSpecificReady = true;

            userSpecificProduct.usingDefaultUserSpecificData =
                userSpecificProductDetails.usingDefaultUserSpecificData;

            let {
                regularChildSkus = [],
                onSaleChildSkus = [],
                simillarSkus = [],
                ymalSkus = [],
                ancillarySkus = []
            } = userSpecificProduct;

            let skuMap = buildMapOfUserSpecificSkuDetails(userSpecificProductDetails);

            Object.assign(userSpecificProduct.currentSku,
                skuMap.get(userSpecificProduct.currentSku.skuId));

            regularChildSkus.forEach((sku, i) => {
                let userSpecificData = skuMap.get(sku.skuId);
                if (userSpecificData) {
                    regularChildSkus[i] =
                        Object.assign(regularChildSkus[i], userSpecificData);
                } else {
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            onSaleChildSkus.forEach((sku, i) => {
                let userSpecificData = skuMap.get(sku.skuId);
                if (userSpecificData) {
                    onSaleChildSkus[i] =
                        Object.assign(onSaleChildSkus[i], userSpecificData);
                } else {
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            simillarSkus.forEach((sku, i) => {
                let userSpecificData = skuMap.get(sku.skuId);
                if (userSpecificData) {
                    simillarSkus[i] =
                        Object.assign(simillarSkus[i], userSpecificData);
                } else {
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            ymalSkus.forEach((sku, i) => {
                let userSpecificData = skuMap.get(sku.skuId);
                if (userSpecificData) {
                    ymalSkus[i] =
                        Object.assign(ymalSkus[i], userSpecificData);
                } else {
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            ancillarySkus.forEach((sku, i) => {
                let userSpecificData = skuMap.get(sku.skuId);
                if (userSpecificData) {
                    ancillarySkus[i] =
                        Object.assign(ancillarySkus[i], userSpecificData);
                } else {
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            // Unlike other properties, recentlyViewedSkus needs to be replaced
            // because recentlyViewedSkus is not available on initial load
            // and thus we need to add it once it is created and pulled as part
            // of full user call after ctrlr is already initialized
            if (userSpecificProductDetails.recentlyViewedSkus) {
                userSpecificProduct.recentlyViewedSkus =
                    userSpecificProductDetails.recentlyViewedSkus;
            }

        }

        return userSpecificProduct;
    }

};

module.exports = UserSpecificProductUtil;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/UserSpecificProduct.js