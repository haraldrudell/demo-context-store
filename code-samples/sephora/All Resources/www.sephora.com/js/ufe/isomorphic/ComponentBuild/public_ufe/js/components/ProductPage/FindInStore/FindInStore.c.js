// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var FindInStore = function () {};

// Added by sephora-jsx-loader.js
FindInStore.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const actions = require('Actions');
const Debounce = require('utils/Debounce');
const DEBOUNCE_KEYUP = 300;

FindInStore.prototype.findInStore = function (e, currentProduct, zipCode) {
    e.preventDefault();
    store.dispatch(actions.showFindInStoreModal(true, currentProduct, zipCode));
};

FindInStore.prototype.showFindInStore = function (e, currentProduct) {
    e.preventDefault();
    let errorMessage = this.storeZipCode.validateError();
    let zipCode = this.storeZipCode.getValue();
    if (!errorMessage) {
        this.findInStore(e, currentProduct, zipCode);
    }
};

FindInStore.prototype.keyUp = function () {
    let storeZipCode = this.storeZipCode.getValue();
    this.setState({ hasInputText: storeZipCode.length > 0 });
};

FindInStore.prototype.handleKeyUp =
    Debounce.throttle(FindInStore.prototype.keyUp, DEBOUNCE_KEYUP);


// Added by sephora-jsx-loader.js
module.exports = FindInStore.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/FindInStore/FindInStore.c.js