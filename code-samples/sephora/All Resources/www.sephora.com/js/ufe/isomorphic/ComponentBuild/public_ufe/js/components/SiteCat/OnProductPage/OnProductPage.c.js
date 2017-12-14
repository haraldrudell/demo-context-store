// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var OnProductPage = function () {};

// Added by sephora-jsx-loader.js
OnProductPage.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const analyticsConsts = require('analytics/constants');

OnProductPage.prototype.ctrlr = function () {
    digitalData.page.category.pageType = analyticsConsts.PAGE_TYPES.PRODUCT;
};


// Added by sephora-jsx-loader.js
module.exports = OnProductPage.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SiteCat/OnProductPage/OnProductPage.c.js