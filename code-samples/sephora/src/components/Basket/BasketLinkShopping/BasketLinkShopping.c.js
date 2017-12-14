// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketLinkShopping = function () {};

// Added by sephora-jsx-loader.js
BasketLinkShopping.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');

BasketLinkShopping.prototype.ctrlr = function () {};

BasketLinkShopping.prototype.handleClick = function () {
    anaUtils.setNextPageData({ linkData: 'basket:continue-shopping' });
    history.back();
};


// Added by sephora-jsx-loader.js
module.exports = BasketLinkShopping.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketLinkShopping/BasketLinkShopping.c.js