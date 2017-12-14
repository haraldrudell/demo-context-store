const Locale = require('utils/LanguageLocale.js');

const TYPES = {
    UPDATE_CAROUSEL: 'UPDATE_CAROUSEL',
    PRODUCT_FINDER_DATA: 'PRODUCT_FINDER_DATA',
    IS_QUIZ_SUBMITTED: 'IS_QUIZ_SUBMITTED'
};

function updateCarousel(recs) {
    let schema;
    let schemas = [];

    var reorg = function (scheme) {
        var prodRecs = [];
        let currencyPrefix = Locale.getCurrentCountry().toUpperCase() === 'US' ? '$' : 'C$';

        (scheme.items || []).forEach(function (product) {
            product.skus = product.skus || [];

            // Filter through product skus returned by certona to get default sku
            var candidates = product.skus.filter(function (sku) {
                return sku.sku_number === product.default_sku_id;
            });

            // If no default sku or default sku is oos, pick another thats in stock
            if (candidates.length === 0 || candidates[0].is_in_stock === false) {
                candidates = product.skus.filter(function (sku) {
                    return sku.is_in_stock !== false;
                });
            }

            // Oragnize data to how sephora components want it
            var candidate = candidates.shift();
            if (candidate) {
                candidate.isCertonaProduct = true;
                candidate.skuImages = { image: candidate.grid_images };
                candidate.brandName = product.brand_name;
                candidate.productName = product.display_name;
                candidate.primaryProduct = product;
                candidate.productId = candidate.primary_product_id;
                candidate.skuId = candidate.sku_number;
                candidate.targetUrl = product.product_url;
                candidate.starRatings = product.rating;
                candidate.isLimitedEdition = candidate.is_limited_edition || false;
                candidate.isNew = candidate.is_new || false;
                candidate.isSephoraExclusive = candidate.is_sephora_exclusive || false;
                candidate.isOnlineOnly = candidate.is_online_only || false;
                candidate.listPrice = candidate.list_price ?
                    currencyPrefix + candidate.list_price.toFixed(2) : '';
                candidate.salePrice = candidate.sale_price ?
                    currencyPrefix + candidate.sale_price.toFixed(2) : '';
                candidate.valuePrice = candidate.value_price ?
                    '(' + currencyPrefix + candidate.value_price.toFixed(2) + ' VALUE)' : '';
                prodRecs = prodRecs.concat(candidate);
            }

            delete product.skus;
        });

        return prodRecs;
    };

    while ((schema = recs.resonance.schemes.shift())) {
        schemas.push({
            isDisplay: schema.display === 'yes',
            recommendTitle: schema.explanation,
            name: schema.scheme,
            data: reorg(schema)
        });
    }

    return {
        type: TYPES.UPDATE_CAROUSEL,
        recs: schemas
    };
}

function getProductFinderData(items) {
    const data = updateCarousel(items);

    return {
        type: TYPES.PRODUCT_FINDER_DATA,
        productFinderData: data.recs[0].data
    };
}

function isQuizSubmitted(value) {
    return {
        type: TYPES.IS_QUIZ_SUBMITTED,
        isQuizSubmitted: value
    };
}

module.exports = {
    TYPES: TYPES,
    updateCarousel: updateCarousel,
    updateProductFinderData: getProductFinderData,
    isQuizSubmitted: isQuizSubmitted
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/CertonaActions.js