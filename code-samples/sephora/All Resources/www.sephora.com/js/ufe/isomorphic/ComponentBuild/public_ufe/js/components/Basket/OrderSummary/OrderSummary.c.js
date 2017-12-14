// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var OrderSummary = function () {};

// Added by sephora-jsx-loader.js
OrderSummary.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const showInfoModal = require('Actions').showInfoModal;
const showMediaModal = require('Actions').showMediaModal;
const store = require('store/Store');
const watch = require('redux-watch');
const reactWindowMixins = require('react-window-mixins');
const ReactDOM = require('react-dom');
const ApplePay = require('services/ApplePay');
const PayPal = require('utils/PayPal');
const basketUtils = require('utils/Basket');
const userUtils = require('utils/User');
const Locale = require('utils/LanguageLocale');

OrderSummary.prototype.ctrlr = function () {
    let basket = store.getState().basket;
    let watchBasket = watch(store.getState, 'basket');
    if (basket.isInitialized) {
        this.updateState(basket);
    }

    store.subscribe(watchBasket(this.updateState));

    store.setAndWatch('basket', null, value => {
        ApplePay.getApplePaymentType(value.basket).then(isApplePayPayment => {
            this.setState({
                isApplePayPayment: isApplePayPayment
            }, () => {
                this.toggleStickyOrderSummary();
            });
        });
    });


};

OrderSummary.prototype.updateState = function (newBasket, oldBasket) {

    let newState = {
        isPaypalPayment: PayPal.getPayPalPaymentType(),
        basket: newBasket,
        subtotal: newBasket.subtotal,
        estimatedShipping: basketUtils.getEstimatedShipping(),
        isCanada: Locale.isCanada(),
        showShippingHandling: this.showShippingAndHandling(newBasket)
    };

    // Switch back to single-button mode for Sticky Checkout Buttons,
    // if showStickyApplePayBtn is updated in basket
    if (newBasket.showStickyApplePayBtn &&
        oldBasket && !oldBasket.showStickyApplePayBtn &&
        (this.state.showStickyOrderSummary || this.state.showModalActionButtons)) {
        newState.showStickyOrderSummary = true;
        newState.showModalActionButtons = false;
    }

    this.setState(newState, () => {
        this.toggleStickyOrderSummary();
    });
};

/**
     * Shipping and Handling should be hidden if one of these conditions exist:
     * Empty basket
     * If under 750 rewards points in empty basket
     * Sample or Rewards only in basket
     * Flash only in basket
     * @param basket
**/
OrderSummary.prototype.showShippingAndHandling = function (basket) {
    return (basket.itemCount === 0 && basketUtils.getAvailableBiPoints() < 750) ||
        basketUtils.isOnlySamplesRewardsInBasket() || basketUtils.isOnlyFlashInBasket();
};

OrderSummary.prototype.openInfoModal = function (title, message) {
    store.dispatch(showInfoModal(true, title, message));
};

OrderSummary.prototype.openMediaModal = function () {
    let shippingMediaId;
    const usShippingMediaId = '15400036';
    const caShippingMediaId = '15400038';
    const flashShippingMediaId = '18100078';
    const shippingModalTitle = 'Shipping & Handling Information';

    if (Locale.isCanada()) {
        shippingMediaId = caShippingMediaId;
    } else {
        shippingMediaId = (basketUtils.getFlashFromBasket() || userUtils.isFlash()) ?
            flashShippingMediaId : usShippingMediaId;
    }

    store.dispatch(showMediaModal(true, shippingMediaId, shippingModalTitle,
        () => store.dispatch(showMediaModal(false))
    ));
};

OrderSummary.prototype.toggleStickyOrderSummary = function () {
    let el = ReactDOM.findDOMNode(this.inlineActionButtons);
    let offset = 0;
    if (el && !this.state.isApplePayPayment) {
        offset = el.offsetHeight;
    }

    let showStickyOrderSummary = window.pageYOffset + window.innerHeight <=
        (el && (el.getBoundingClientRect().top + document.body.scrollTop + offset));
    this.setState({
        showStickyOrderSummary: showStickyOrderSummary
    });
};

OrderSummary.prototype.onStickyCheckoutClick = function () {
    this.setState({
        showModalActionButtons: true,
        showStickyOrderSummary: false
    });
};

OrderSummary.prototype.onActionButtonsDismiss = function () {
    this.setState({
        showModalActionButtons: false,
        showStickyOrderSummary: true
    });
};

if (Sephora.isMobile()) {
    OrderSummary.prototype.mixins = [reactWindowMixins.OnScroll];
    OrderSummary.prototype.onScroll = OrderSummary.prototype.toggleStickyOrderSummary;
}


// Added by sephora-jsx-loader.js
module.exports = OrderSummary.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/OrderSummary/OrderSummary.c.js