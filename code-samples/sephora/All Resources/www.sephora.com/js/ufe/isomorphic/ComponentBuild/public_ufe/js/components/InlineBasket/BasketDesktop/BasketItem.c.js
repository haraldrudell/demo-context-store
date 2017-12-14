// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketItem = function () {};

// Added by sephora-jsx-loader.js
BasketItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ReactDOM = require('react-dom');
const BasketActions = require('actions/BasketActions');
const store = require('store/Store');

BasketItem.prototype.onMouseEnterHandler = function () {
    this.setState({
        isHover: true
    });
};

BasketItem.prototype.onMouseLeaveHandler = function () {
    this.setState({
        isHover: false
    });
};

BasketItem.prototype.removeItemFromBasket = function (event) {
    store.dispatch(
        BasketActions.removeItemFromBasket(this.props.item)
    );
};



// Added by sephora-jsx-loader.js
module.exports = BasketItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/InlineBasket/BasketDesktop/BasketItem.c.js