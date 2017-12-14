// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var NeedAssistance = function () {};

// Added by sephora-jsx-loader.js
NeedAssistance.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const UserUtils = require('utils/User');

NeedAssistance.prototype.ctrlr = function () {
    this.setState({
        currentCountry: UserUtils.getShippingCountry().countryCode
    });
};


// Added by sephora-jsx-loader.js
module.exports = NeedAssistance.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/NeedAssistance/NeedAssistance.c.js