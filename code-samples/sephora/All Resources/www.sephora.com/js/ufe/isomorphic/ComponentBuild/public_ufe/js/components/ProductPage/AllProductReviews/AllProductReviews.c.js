// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AllProductReviews = function () {};

// Added by sephora-jsx-loader.js
AllProductReviews.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Location = require('utils/Location');
const store = require('Store');
const ProductActions = require('actions/ProductActions');
const UrlUtils = require('utils/Url');
const productPageBindings =
    require('analytics/bindingMethods/pages/productPage/productPageBindings');
const bindingMethods = require('analytics/bindingMethods/pages/all/generalBindings');


AllProductReviews.prototype.ctrlr = function () {
    let productId = null;
    let skuId = null;

    let loc = Location.getLocation();
    if (loc.pathname) {
        let match = loc.href.match(/productId=(P\d+)/i);
        if (match) {
            productId = match[1];
        }

        skuId = UrlUtils.getParamsByName('skuId');
    }

    store.setAndWatch({ 'product.currentProduct': 'product' }, this, (res) => {
        if (Sephora.isMobile() && res.product.parentCategory) {
            digitalData.page.attributes = digitalData.page.attributes || {};
            let world = productPageBindings.getProductWorld(res.product);
            digitalData.page.attributes.world = world;

            digitalData.page.attributes.sephoraPageInfo.pageName =
                bindingMethods.getSephoraPageName();
            Sephora.analytics.resolvePromises.productDataReady();
        }
    });

    store.dispatch(ProductActions.fetchCurrentProduct(productId, skuId));

    if (Sephora.isMobile()) {
        digitalData.page.category.pageType = 'reviews';
        digitalData.page.pageInfo.pageName = 'ratings&reviews-view';
    }

};

AllProductReviews.prototype.goBackToProductPage = function (productPageUrl) {
    Location.setLocation(productPageUrl);
};


// Added by sephora-jsx-loader.js
module.exports = AllProductReviews.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/AllProductReviews/AllProductReviews.c.js