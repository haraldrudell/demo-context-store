// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MobilePromoList = function () {};

// Added by sephora-jsx-loader.js
MobilePromoList.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');

MobilePromoList.prototype.ctrlr = function () {
    store.setAndWatch('basket', null, value => this.setState({
        basketPromosList: value.basket.promos
    }));
};



// Added by sephora-jsx-loader.js
module.exports = MobilePromoList.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/PromoSection/MobilePromoList/MobilePromoList.c.js