// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CountrySwitcherModal = function () {};

// Added by sephora-jsx-loader.js
CountrySwitcherModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const showCountrySwitcherModal = require('Actions').showCountrySwitcherModal;
const switchCountry = require('actions/UserActions').switchCountry;

CountrySwitcherModal.prototype.ctrlr = function () {
    var cart = store.getState().basket;
    this.setState({
        hasCommerceItems: cart.items && cart.items.length && cart.items.length > 0
    });
};

CountrySwitcherModal.prototype.close = function () {
    store.dispatch(showCountrySwitcherModal(false));
};

CountrySwitcherModal.prototype.switchCountry = function (ctry, lang) {
    store.dispatch(switchCountry(ctry, lang));
};


// Added by sephora-jsx-loader.js
module.exports = CountrySwitcherModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/CountrySwitcherModal/CountrySwitcherModal.c.js