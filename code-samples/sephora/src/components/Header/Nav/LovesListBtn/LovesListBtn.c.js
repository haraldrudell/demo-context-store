// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var LovesListBtn = function () {};

// Added by sephora-jsx-loader.js
LovesListBtn.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');

LovesListBtn.prototype.trackLoveClick = function () {

    //Analytics
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(['top nav', 'loves icon'])
    });
};


// Added by sephora-jsx-loader.js
module.exports = LovesListBtn.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/LovesListBtn/LovesListBtn.c.js