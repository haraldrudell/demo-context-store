// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var FooterLinks = function () {};

// Added by sephora-jsx-loader.js
FooterLinks.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const userUtils = require('utils/User');

FooterLinks.prototype.ctrlr = function () {
    store.setAndWatch('user', null, (data) => {
        this.setState({
            isAnonymous: userUtils.isAnonymous()
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = FooterLinks.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Footer/FooterLinks/FooterLinks.c.js