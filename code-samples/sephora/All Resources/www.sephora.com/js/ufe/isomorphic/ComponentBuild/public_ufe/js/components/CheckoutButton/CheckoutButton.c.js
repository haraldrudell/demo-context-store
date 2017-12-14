// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CheckoutButton = function () {};

// Added by sephora-jsx-loader.js
CheckoutButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const checkoutUtils = require('utils/Checkout');
const Actions = require('Actions');
const anaUtils = require('analytics/utils');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const clickCheckout = require('analytics/bindings/pages/basket/clickCheckout');

CheckoutButton.prototype.ctrlr = function () {
    let basket = store.getState().basket;
    let watchBasket = watch(store.getState, 'basket');

    this.setState({ basket });

    store.subscribe(watchBasket((newBasket) => {
        this.setState({
            basket: newBasket
        });
    }));
};

//TODO: Refactor to get this business logic out of the checkout button components
// (regular, apple pay, paypal - almost identical functionality in all three
CheckoutButton.prototype.checkout = function () {
    this.standardCheckoutClicked();
    // Disable applePay session, if it was active
    store.dispatch(Actions.enableApplePaySession(false));

    return checkoutUtils.initializeCheckout().
        then(checkoutUtils.initOrderSuccess).
        catch(checkoutUtils.initOrderFailure);
};

CheckoutButton.prototype.standardCheckoutClicked = function () {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: [clickCheckout]
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = CheckoutButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CheckoutButton/CheckoutButton.c.js