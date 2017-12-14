const store = require('Store');
const basketUtils = require('utils/Basket');
const userUtils = require('utils/User');
const localeUtils = require('utils/LanguageLocale');
const checkoutApi = require('services/api/checkout');

let paypalIntegration;
let paypalCallback;
let paypalToken;
let isTokenRequestInProgress;

const TYPES = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
    HIDDEN: 'HIDDEN'
};

const PayPal = {
    TYPES: TYPES,

    getPayPalPaymentType: function () {
        let basket = store.getState().basket;
        let shippingCountry = userUtils.getShippingCountry().countryCode;
        let isShowPayPal = basket.isPaypalPaymentEnabled && (Sephora.isMobile() ||
        (shippingCountry === localeUtils.COUNTRIES.US ||
        shippingCountry === localeUtils.COUNTRIES.CA));

        if (isShowPayPal) {
            return basketUtils.isPaypalRestricted() ? TYPES.DISABLED : TYPES.ENABLED;
        } else {
            return TYPES.HIDDEN;
        }
    },

    preparePaypalCheckout: function () {
        if (!paypalToken) {
            if (!isTokenRequestInProgress) {
                isTokenRequestInProgress = true;
                checkoutApi.getPayPalToken().
                    then(data => {
                        PayPal.paypalSetup(data.token);
                        isTokenRequestInProgress = false;
                    }).catch(() => {
                        isTokenRequestInProgress = false;
                    });
            }
        } else {
            PayPal.paypalSetup(paypalToken);
        }
    },

    /**
     * Keep this function as plain as possible!
     * No promises, callback chains -> any of this logic could be treated as a
     * suspicious behavior and browser will block the new window with PayPal
     * Explanation of the issue:
     * http://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers
     * @param callback
     */
    showPayPal: function (callback) {
        paypalCallback = callback;
        paypalIntegration.paypal.initAuthFlow();
    },

    paypalSetup: function (clientToken) {
        paypalToken = clientToken;
        const braintree = require('Braintree');
        braintree.setup(clientToken, 'custom', {
            enableCORS: true,
            onReady: function (integration) {
                paypalIntegration = integration;
            },

            onPaymentMethodReceived: function (payload) {
                if (typeof paypalCallback === 'function') {
                    paypalCallback(payload);
                }
            },

            onError: function (error) {},

            onCancelled: function (obj) {},

            onSuccess: function (obj) {},

            paypal: {
                onUnsupported: function (obj) {},

                onCancelled: function (obj) {},

                billingAgreementDescription: 'Estimated Total: ' + basketUtils.getSubtotal(true),
                container: 'paypal-container',
                singleUse: false,
                amount: basketUtils.getSubtotal(),
                currency: (localeUtils.getCurrentCountry() === 'CA') ? 'CAD' : 'USD',
                enableShippingAddress: true,
                enableBillingAddress: true,
                headless: true
            }
        });
    }
};

module.exports = PayPal;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/PayPal.js