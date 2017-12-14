// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var FlashProduct = function () {};

// Added by sephora-jsx-loader.js
FlashProduct.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProductWatcher = require('../ProductWatcher');
const ProductActions = require('actions/ProductActions');
const productPageBindings =
    require('analytics/bindingMethods/pages/productPage/productPageBindings');

FlashProduct.prototype.ctrlr = function () {
    // Initial population of the product data in the store
    store.dispatch(ProductActions.updateCurrentProduct(this.props.currentProduct));

    ProductWatcher.watchProductAndUser(this);
    ProductWatcher.watchTestTarget(this);

    //Analytics
    productPageBindings.initializeAnalyticsObjectWithProductData();
};


// Added by sephora-jsx-loader.js
module.exports = FlashProduct.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/FlashProduct/FlashProduct.c.js