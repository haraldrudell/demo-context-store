// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ShippingMessage = function () {};

// Added by sephora-jsx-loader.js
ShippingMessage.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');

ShippingMessage.prototype.ctrlr = function () {
    let basket = store.getState().basket;
    let watchBasket = watch(store.getState, 'basket');

    this.setState({
        basket: basket
    });

    store.subscribe(watchBasket((newBasket) => {
        this.setState({
            basket: newBasket
        });
    }));
};



// Added by sephora-jsx-loader.js
module.exports = ShippingMessage.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/ShippingMessage/ShippingMessage.c.js