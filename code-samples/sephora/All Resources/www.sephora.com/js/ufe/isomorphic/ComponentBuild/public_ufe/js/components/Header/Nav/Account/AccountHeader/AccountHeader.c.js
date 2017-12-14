// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountHeader = function () {};

// Added by sephora-jsx-loader.js
AccountHeader.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');

AccountHeader.prototype.ctrlr = function () {
    store.setAndWatch(['user', 'socialInfo.socialProfile', 'socialInfo.isLithiumSuccessful'], this);
};

AccountHeader.prototype.toggleOpen = function () {
    this.setState({
        isOpen: !this.state.isOpen
    });
};


// Added by sephora-jsx-loader.js
module.exports = AccountHeader.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Account/AccountHeader/AccountHeader.c.js