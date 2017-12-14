// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TermsConditionsModal = function () {};

// Added by sephora-jsx-loader.js
TermsConditionsModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const showTermsConditions = require('actions/TermsAndConditionsActions').showModal;

TermsConditionsModal.prototype.ctrlr = function () {
    const termsConditionsWatch = watch(store.getState, 'termsConditions');
    store.subscribe(termsConditionsWatch(newVal => this.setState(newVal)));
};

TermsConditionsModal.prototype.requestClose = function () {
    store.dispatch(showTermsConditions(false));
};


// Added by sephora-jsx-loader.js
module.exports = TermsConditionsModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/TermsConditionsModal/TermsConditionsModal.c.js