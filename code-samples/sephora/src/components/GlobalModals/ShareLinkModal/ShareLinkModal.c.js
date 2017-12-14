// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ShareLinkModal = function () {};

// Added by sephora-jsx-loader.js
ShareLinkModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showShareLinkModal = require('Actions').showShareLinkModal;

ShareLinkModal.prototype.requestClose = function (e) {
    store.dispatch(showShareLinkModal(false));
};


// Added by sephora-jsx-loader.js
module.exports = ShareLinkModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/ShareLinkModal/ShareLinkModal.c.js