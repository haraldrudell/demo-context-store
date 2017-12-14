// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var GlobalModalsWrapper = function () {};

// Added by sephora-jsx-loader.js
GlobalModalsWrapper.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const showBccModal = require('Actions').showBccModal;

GlobalModalsWrapper.prototype.ctrlr = function () {
    let w = watch(store.getState, 'modals');
    store.subscribe(w((newVal, oldVal, objectPath) =>
        this.setState(newVal))
    );

    let initialState = store.getState().modals;
    initialState.renderModals = true;
    this.setState(initialState);
};

GlobalModalsWrapper.prototype.closeBccModal = function () {
    store.dispatch(showBccModal(false, null));
};


// Added by sephora-jsx-loader.js
module.exports = GlobalModalsWrapper.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/GlobalModalsWrapper/GlobalModalsWrapper.c.js