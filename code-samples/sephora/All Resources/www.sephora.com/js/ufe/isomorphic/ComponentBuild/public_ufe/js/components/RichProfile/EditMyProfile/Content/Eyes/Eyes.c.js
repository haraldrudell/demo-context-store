// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Eyes = function () {};

// Added by sephora-jsx-loader.js
Eyes.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;

Eyes.prototype.getData = function () {
    return {
        biAccount: {
            personalizedInformation: {
                eyeColor: this.state.eyeColor
            }
        }
    };
};


// Added by sephora-jsx-loader.js
module.exports = Eyes.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Eyes/Eyes.c.js