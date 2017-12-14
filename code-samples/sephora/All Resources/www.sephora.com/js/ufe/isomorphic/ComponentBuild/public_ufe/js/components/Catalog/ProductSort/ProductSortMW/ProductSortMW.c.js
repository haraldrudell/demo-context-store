// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductSortMW = function () {};

// Added by sephora-jsx-loader.js
ProductSortMW.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
ProductSortMW.prototype.ctrlr = function () {};

ProductSortMW.prototype.handleOnClick = function() {
    this.setState({
        isActive: !this.state.isActive
    });
};


// Added by sephora-jsx-loader.js
module.exports = ProductSortMW.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSortMW/ProductSortMW.c.js