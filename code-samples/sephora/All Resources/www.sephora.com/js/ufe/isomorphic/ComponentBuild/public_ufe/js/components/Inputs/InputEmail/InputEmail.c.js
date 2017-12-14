// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InputEmail = function () {};

// Added by sephora-jsx-loader.js
InputEmail.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
InputEmail.prototype.getValue = function () {
    return this.input.getValue();
};

InputEmail.prototype.validateError = function () {
    return this.input.validateError();
};

InputEmail.prototype.empty = function () {
    return this.input.empty();
};

InputEmail.prototype.focus = function () {
    return this.input.focus();
};


// Added by sephora-jsx-loader.js
module.exports = InputEmail.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputEmail/InputEmail.c.js