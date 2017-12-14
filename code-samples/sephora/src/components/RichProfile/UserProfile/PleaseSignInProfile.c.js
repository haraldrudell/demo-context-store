// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PleaseSignInProfile = function () {};

// Added by sephora-jsx-loader.js
PleaseSignInProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;

PleaseSignInProfile.prototype.signInHandler = function () {
    this.setState({
        showPleaseSignInBlock: false
    });
};


// Added by sephora-jsx-loader.js
module.exports = PleaseSignInProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/PleaseSignInProfile.c.js