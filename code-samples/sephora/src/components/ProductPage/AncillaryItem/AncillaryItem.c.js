// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AncillaryItem = function () {};

// Added by sephora-jsx-loader.js
AncillaryItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
AncillaryItem.prototype.ctrlr = function () {};

AncillaryItem.prototype.toggleHover = function () {
    if (!Sephora.isTouch) {
        this.setState({ hover: !this.state.hover });
    }
};


// Added by sephora-jsx-loader.js
module.exports = AncillaryItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/AncillaryItem/AncillaryItem.c.js