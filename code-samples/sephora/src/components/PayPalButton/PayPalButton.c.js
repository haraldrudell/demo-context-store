// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PayPalButton = function () {};

// Added by sephora-jsx-loader.js
PayPalButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const PayPal = require('utils/PayPal');
const basketActions = require('actions/BasketActions');
const orderActions = require('actions/OrderActions');
const userActions = require('actions/UserActions');
const basketUtils = require('utils/Basket');
const checkoutUtils = require('utils/Checkout');
const actions = require('Actions');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const userUtils = require('utils/User');
const checkoutApi = require('services/api/checkout');
const { withInterstice } = require('utils/decorators');

PayPalButton.prototype.ctrlr = function () {
    /**
     * Prepare payPal object with updated basket data every time on basket change.
     * So when we'll want to show the PayPal new window -> the chain of calls should be
     * as short as possible, otherwise browser will block the new window.
     * Explanation of the issue:
     * http://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers
     *
     * And don't forget to refresh Paypal obj on every basket update
     */
    store.setAndWatch('basket', null, () => {
        PayPal.preparePaypalCheckout();
    });
};

PayPalButton.prototype.checkoutWithPayPal = function () {
    return new Promise((resolve, reject) => {

        if (basketUtils.containsRestrictedItem()) {
            store.dispatch(basketActions.showPaypalRestrictedMessage());
            reject();
            return;
        }

        //Analytics
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'checkout:payment:paypal',
                actionInfo: 'checkout:payment:paypal',
                eventStrings: [anaConsts.Event.EVENT_71]
            }
        });

        // Disable applePay session, if it was active
        store.dispatch(actions.enableApplePaySession(false));

        let basket = store.getState().basket;

        if (basket.showPaypalPopUp) {
            if (basketUtils.isOnlySamplesRewardsInBasket(true) &&
                    !userUtils.isAnonymous()) {

                const NO_STANDARD_GOODS_ERROR =
                    'You must add merchandise before you can proceed to checkout.';
                store.dispatch(basketActions.showError({
                    internalError: NO_STANDARD_GOODS_ERROR
                }));
                reject();
            } else {
                PayPal.showPayPal(payload => {

                    let PayPalApiError = {
                        // is expected for New user flow
                        UNAUTHORIZED: 403,

                        // is a flag from API that they ignored Paypal address
                        INVALID_LOCALE: -10182
                    };

                    withInterstice(checkoutApi.initializePayPalCheckout)(payload).
                        then(() => {
                            // Populate user email from PayPal, if it's empty in store

                            let user = store.getState().user;
                            if (payload && payload.details && !user.login) {
                                user.login = payload.details.email;
                                store.dispatch(userActions.update(user));
                            }

                            this.goToCheckout();
                            resolve();
                        }).
                        catch(reason => {
                            if (reason.errorCode === PayPalApiError.INVALID_LOCALE ||
                                    reason.errorCode === PayPalApiError.UNAUTHORIZED) {

                                // Nothing here so far.
                            }
                            reject();
                        });

                });
            }
        } else {
            this.goToCheckout();
            resolve();
        }
    });
};

PayPalButton.prototype.goToCheckout = function () {
    return checkoutUtils.initializeCheckout({ isPaypalFlow: true }).
        then(checkoutUtils.initOrderSuccess).
        catch(checkoutUtils.initOrderFailure);
};


// Added by sephora-jsx-loader.js
module.exports = PayPalButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/PayPalButton/PayPalButton.c.js