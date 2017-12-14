// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductQuicklook = function () {};

// Added by sephora-jsx-loader.js
ProductQuicklook.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const Actions = require('Actions');
const skuUtils = require('utils/Sku');
const snbApi = require('services/api/search-n-browse');

ProductQuicklook.prototype.ctrlr = function () { };

ProductQuicklook.prototype.handleOnClick = function (e, productId, skuId, isCertonaProduct) {
    e.preventDefault();

    let sku = this.props.sku;
    let skuType = this.props.skuType;

    // TODO: what to do if product cannot be shown

    if (skuType === skuUtils.skuTypes.REWARD) {
        snbApi.getProductDetails(productId, skuId).
            then(data => this.dispatchQuicklook(data, skuType, sku));

    } else if (skuType === skuUtils.skuTypes.SAMPLE) {
        productId = sku.primaryProduct ? sku.primaryProduct.productId : null;
        snbApi.getProductDetails(productId, skuId).
            then(data => this.dispatchQuicklook(data, skuType, sku));

    } else {
        skuType = skuUtils.skuTypes.STANDARD;
        snbApi.getProductDetails(productId, skuId).
            then(data => this.dispatchQuicklook(data, skuType, sku, isCertonaProduct));
    }
};

ProductQuicklook.prototype.dispatchQuicklook = function (product, skuType, sku, isCertonaProduct) {
    store.dispatch(Actions.updateQuickLookContent(product, sku));
    store.dispatch(Actions.showQuickLookModal(true, skuType, sku, isCertonaProduct));

    let anaConsts = require('analytics/constants');

    require('analytics/processEvent').process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            product,
            rootContainerName: this.props.rootContainerName,
            bindingMethods: [require('analytics/bindings/pages/all/quickLookLoad')],
            sku: (sku || (product && product.currentSku))
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = ProductQuicklook.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductQuicklook/ProductQuicklook.c.js