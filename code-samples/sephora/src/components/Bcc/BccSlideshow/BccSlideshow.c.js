// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccSlideshow = function () {};

// Added by sephora-jsx-loader.js
BccSlideshow.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
// This controller only exists so that BccSlideshow will be recognised as a root component
// so that carousel is not since it uses props.children.
BccSlideshow.prototype.ctrlr = function () {};


// Added by sephora-jsx-loader.js
module.exports = BccSlideshow.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccSlideshow/BccSlideshow.c.js