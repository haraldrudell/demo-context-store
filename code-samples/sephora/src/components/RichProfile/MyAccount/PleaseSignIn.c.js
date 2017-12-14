// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PleaseSignIn = function () {};

// Added by sephora-jsx-loader.js
PleaseSignIn.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const auth = require('utils/Authentication');

PleaseSignIn.prototype.signInHandler = function () {
    auth.requireAuthentication();
};


// Added by sephora-jsx-loader.js
module.exports = PleaseSignIn.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/PleaseSignIn.c.js