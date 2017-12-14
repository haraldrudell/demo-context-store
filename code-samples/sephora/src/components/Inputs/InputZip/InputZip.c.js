// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InputZip = function () {};

// Added by sephora-jsx-loader.js
InputZip.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
InputZip.prototype.getValue = function () {
    return this.input.getValue();
};

InputZip.prototype.validateError = function () {
    return this.input.validateError();
};

InputZip.prototype.empty = function () {
    return this.input.empty();
};

InputZip.prototype.focus = function () {
    return this.input.focus();
};


// Added by sephora-jsx-loader.js
module.exports = InputZip.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputZip/InputZip.c.js