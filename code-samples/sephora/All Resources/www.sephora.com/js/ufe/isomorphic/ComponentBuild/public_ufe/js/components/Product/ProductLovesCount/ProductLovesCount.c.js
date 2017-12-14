// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductLovesCount = function () {};

// Added by sephora-jsx-loader.js
ProductLovesCount.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const skuUtils = require('utils/Sku');

ProductLovesCount.prototype.ctrlr = function () {

    /**
     * API doesn't respond immediately with proper count of product loves.
     * Count will be updated on server side only in 3 hours,
     * so we need to listen for user loves actions and mimic the effect of
     * immediate updating of Product loves count
     */
    store.setAndWatch('loves.shoppingListIds', null, () => {
        this.setState({ lovesCount: skuUtils.getProductLovesCount(this.props.product) });
    });
};


// Added by sephora-jsx-loader.js
module.exports = ProductLovesCount.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductLovesCount/ProductLovesCount.c.js