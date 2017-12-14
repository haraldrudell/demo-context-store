// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PlayProduct = function () {};

// Added by sephora-jsx-loader.js
PlayProduct.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProductWatcher = require('../ProductWatcher');
const ProductActions = require('actions/ProductActions');
const TestTargetUtils = require('utils/TestTarget.js');
const productPageBindings =
    require('analytics/bindingMethods/pages/productPage/productPageBindings');

PlayProduct.prototype.ctrlr = function () {
    // Initial population of the product data in the store
    store.dispatch(ProductActions.updateCurrentProduct(this.props.currentProduct));

    ProductWatcher.watchProductAndUser(this);
    ProductWatcher.watchTestTarget(this, (PPageTestAndTargetData) => {
        let targetResults = TestTargetUtils.checkTestAndTargetFlags(PPageTestAndTargetData);
        this.setState({ targetResults, targetResolved: true });
    });

    //Analytics
    productPageBindings.initializeAnalyticsObjectWithProductData();
};


// Added by sephora-jsx-loader.js
module.exports = PlayProduct.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/PlayProduct/PlayProduct.c.js