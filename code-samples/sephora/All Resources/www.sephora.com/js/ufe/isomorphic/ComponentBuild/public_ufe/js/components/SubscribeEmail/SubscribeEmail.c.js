// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SubscribeEmail = function () {};

// Added by sephora-jsx-loader.js
SubscribeEmail.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
SubscribeEmail.prototype.handleSubscribe = function (e) {
    this.setState({
        checked: e.target.checked
    });
};

SubscribeEmail.prototype.getValue = function () {
    return this.state.checked;
};

SubscribeEmail.prototype.setChecked = function (value) {
    this.setState({
        checked: value
    });
};


// Added by sephora-jsx-loader.js
module.exports = SubscribeEmail.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SubscribeEmail/SubscribeEmail.c.js