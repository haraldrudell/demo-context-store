// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketLoves = function () {};

// Added by sephora-jsx-loader.js
BasketLoves.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const Authentication = require('utils/Authentication');
const userUtils = require('utils/User');
const Events = require('utils/framework/Events');

BasketLoves.prototype.ctrlr = function () {
    Events.onLastLoadEvent(window, [Events.UserInfoReady], ()=> {
        store.setAndWatch('user', null, () => {
            this.setState({
                isLoggedIn: !userUtils.isAnonymous()
            });
        });
    });
};

BasketLoves.prototype.signInHandler = function (e) {
    e.stopPropagation();

    Authentication.requireAuthentication();
};


// Added by sephora-jsx-loader.js
module.exports = BasketLoves.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketLoves/BasketLoves.c.js