// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var HiddenInput = function () {};

// Added by sephora-jsx-loader.js
HiddenInput.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
HiddenInput.prototype.getValue = function () {
    return this.state.value;
};

HiddenInput.prototype.setValue = function (value) {
    this.setState({
        value: value
    });
};

HiddenInput.prototype.empty = function (value) {
    this.setValue('');
};


// Added by sephora-jsx-loader.js
module.exports = HiddenInput.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/HiddenInput/HiddenInput.c.js