// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SkuQuantity = function () {};

// Added by sephora-jsx-loader.js
SkuQuantity.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const skuUtils = require('utils/Sku');
SkuQuantity.prototype.ctrlr = function () {
    this.setState({
        quantities: skuUtils.purchasableQuantities(this.props.currentSku)
    });
};



// Added by sephora-jsx-loader.js
module.exports = SkuQuantity.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/SkuQuantity/SkuQuantity.c.js