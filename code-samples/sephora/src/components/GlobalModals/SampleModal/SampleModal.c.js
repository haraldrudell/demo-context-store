// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SampleModal = function () {};

// Added by sephora-jsx-loader.js
SampleModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showSampleModal = require('Actions').showSampleModal;

SampleModal.prototype.isDone = function (e) {
    store.dispatch(showSampleModal(false));
};



// Added by sephora-jsx-loader.js
module.exports = SampleModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/SampleModal/SampleModal.c.js