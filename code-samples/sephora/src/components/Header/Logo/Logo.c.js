// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Logo = function () {};

// Added by sephora-jsx-loader.js
Logo.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');

Logo.prototype.trackClick = function () {

    //Analytics
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(['top nav', 'sephora icon'])
    });
};


// Added by sephora-jsx-loader.js
module.exports = Logo.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Logo/Logo.c.js