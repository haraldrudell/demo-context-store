// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Service = function () {};

// Added by sephora-jsx-loader.js
Service.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const actions = require('Actions');

Service.prototype.showFindInStore = function (e, sku) {
    e.preventDefault();
    store.dispatch(actions.showFindInStoreModal(true, sku));
};


// Added by sephora-jsx-loader.js
module.exports = Service.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/StoreServices/Service/Service.c.js