// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var OtherPayments = function () {};

// Added by sephora-jsx-loader.js
OtherPayments.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const ReactDom = require('react-dom');
const store = require('Store');
const watch = require('redux-watch');

OtherPayments.prototype.ctrlr = function () {
    let basket = store.getState('basket').basket;

    if (basket.isInitialized) {
        this.setState({ isPaypalEnabled: basket.isPaypalPaymentEnabled });
    } else {
        let paypalWatch = watch(store.getState, 'basket.isPaypalPaymentEnabled');
        store.subscribe(paypalWatch(isPaypalPaymentEnabled => {
            this.setState({ isPaypalEnabled: isPaypalPaymentEnabled });
            paypalWatch();
        }));
    }
};

OtherPayments.prototype.removePaypal = function () {
    profileApi.removePayPalFromProfile(this.props.userProfileId).then(() => {
        let element = ReactDom.findDOMNode(this);
        element.remove();
    });
};


// Added by sephora-jsx-loader.js
module.exports = OtherPayments.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/OtherPayments/OtherPayments.c.js