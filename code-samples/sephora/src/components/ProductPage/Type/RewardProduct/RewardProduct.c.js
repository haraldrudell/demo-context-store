// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RewardProduct = function () {};

// Added by sephora-jsx-loader.js
RewardProduct.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProductWatcher = require('../ProductWatcher');
const ProductActions = require('actions/ProductActions');
const RewardActions = require('actions/RewardActions');
const olapicUtils = require('utils/Olapic');
const TestTargetUtils = require('utils/TestTarget.js');

RewardProduct.prototype.ctrlr = function () {
    // Initial population of the product data in the store
    store.dispatch(ProductActions.updateCurrentProduct(this.props.currentProduct));

    ProductWatcher.processSkuId(this);

    ProductWatcher.watchProductAndUser(this);
    ProductWatcher.watchTestTarget(this, (PPageTestAndTargetData) => {
        let targetResults = TestTargetUtils.checkTestAndTargetFlags(PPageTestAndTargetData);
        this.setState({ targetResults, targetResolved: true });
    });

    // Initial population of rewards
    store.setAndWatch('basket', this);

    //include global functions needed by Olapic
    olapicUtils.includeOlapicScripts();

    //Analytics
    require.ensure([], function (require) {
        const productPageBindings =
            require('analytics/bindingMethods/pages/productPage/productPageBindings');
        productPageBindings.initializeAnalyticsObjectWithProductData();
    }, 'components');
};


// Added by sephora-jsx-loader.js
module.exports = RewardProduct.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/RewardProduct/RewardProduct.c.js