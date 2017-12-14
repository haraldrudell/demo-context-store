// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var QuickLookModal = function () {};

// Added by sephora-jsx-loader.js
QuickLookModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const actions = require('Actions');
const blueCore = require('analytics/bluecore');

QuickLookModal.prototype.requestClose = function () {
    store.dispatch(actions.showQuickLookModal(false));
};

QuickLookModal.prototype.ctrlr = function () {
    let defaultSku = this.getDefaultSku(this.props.product);
    let currentSkuWatch = watch(store.getState, 'product');

    this.setState({ currentSku: defaultSku });

    store.subscribe(currentSkuWatch((newVal, oldVal, objectPath) => {
        this.setState({ currentSku: newVal.currentSku });
    }));

    blueCore.productViewedEvent(this.props.product.productId);
};

QuickLookModal.prototype.getDefaultSku = function (product) {
    let defaultSku = null;

    if (product.currentSku) {
        defaultSku = product.currentSku;
        return defaultSku;
    } else {
        return product;
    }
};


// Added by sephora-jsx-loader.js
module.exports = QuickLookModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/QuickLookModal.c.js