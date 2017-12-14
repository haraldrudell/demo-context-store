// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Play = function () {};

// Added by sephora-jsx-loader.js
Play.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const subscribeToPlayProduct = require('actions/UserActions').playSubscription;

Play.prototype.subscribePlay = function () {
    store.dispatch(
        subscribeToPlayProduct(this.props.currentSku.skuId, this.props.productId)
    );
};


// Added by sephora-jsx-loader.js
module.exports = Play.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/Type/Play/Play.c.js