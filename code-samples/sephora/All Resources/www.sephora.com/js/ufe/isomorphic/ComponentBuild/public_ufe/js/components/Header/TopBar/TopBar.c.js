// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TopBar = function () {};

// Added by sephora-jsx-loader.js
TopBar.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');

TopBar.prototype.ctrlr = function () {};

//Analytics
TopBar.prototype.trackClick = function (linkText) {
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(['toolbar', linkText])
    });
};


// Added by sephora-jsx-loader.js
module.exports = TopBar.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/TopBar/TopBar.c.js