// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SelectShade = function () {};

// Added by sephora-jsx-loader.js
SelectShade.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
SelectShade.prototype.ctrlr = function () {};

SelectShade.prototype.componentWillReceiveProps = function (updatedProps) {
    this.setState(updatedProps);
};


// Added by sephora-jsx-loader.js
module.exports = SelectShade.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/SelectShade/SelectShade.c.js