// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketTitle = function () {};

// Added by sephora-jsx-loader.js
BasketTitle.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const userUtils = require('utils/User.js');

BasketTitle.prototype.ctrlr = function () {
    this.setState({
        shipCountry: userUtils.getShippingCountry().countryCode
    });
};


// Added by sephora-jsx-loader.js
module.exports = BasketTitle.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketTitle/BasketTitle.c.js