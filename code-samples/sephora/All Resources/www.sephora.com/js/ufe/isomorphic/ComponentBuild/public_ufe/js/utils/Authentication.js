// TODO Mykhaylo Gavrylyuk: Now after doing all the services/api refactoring,
// I trully believe that Authenticate and Refetch should be refactored into
// services. They are not utils by their nature, though treated and used as such.


const RestApi = require('./RestApi');
const SUBMIT_ORDER_URL = '/api/checkout/submitOrder';
const showInterstice = require('Actions').showInterstice;
const Location = require('utils/Location');
const orderActions = require('actions/OrderActions');
const store = require('Store');
const userUtils = require('utils/User');
const userActions = require('actions/UserActions');
const cookieUtil = require('utils/Cookies');
const ssiApi = require('services/api/ssi');

const ORDER_INIT_API = '/api/checkout/order/init';

var handleTimeout = function (originalUrl, originalOptions, originalResolve, response, message) {
    let user = store.getState().user;
    let basket = store.getState().basket;
    let options = originalOptions && originalOptions.body ? JSON.parse(originalOptions.body) : {};
    let oldUserId = user.profileId;
    let oldOrderId = basket.orderId;
    let isBasketInitCheckout = originalUrl.indexOf(ORDER_INIT_API) >= 0 &&
        Location.isBasketPage();

    var afterSignIn = function (userData) {
        if (isBasketInitCheckout && userData.isNewUserFlow) {
            // Try to init order after interrrupt by sign in
            const checkoutUtils = require('utils/Checkout');
            checkoutUtils.initializeCheckout({
                isPaypalFlow: options.isPaypalFlow,
                isApplePayFlow: options.isApplePayFlow,
                user: userData }).
            then(originalResolve).
            catch(() => {
                // TODO It's so strange we don't have anything here.
            });

        } else if (originalUrl.indexOf(SUBMIT_ORDER_URL) !== -1) {
            // Do not Submit Order silently, after relogin.
            // Let user review the Order before submitting
            Location.reload();
        } else {
            let refetch = require('Refetch');

            refetch.fetch(originalUrl, originalOptions).then(function (res) {
                originalResolve(res);
            });
        }
    };

    store.dispatch(showInterstice(false));

    // make user recognized, if store thinks that she's still signed In
    if (userUtils.isSignedIn()) {
        user.profileStatus = 2;
        store.dispatch(userActions.update(user));
    }

    let showSignInModal = require('Actions').showSignInModal;
    store.dispatch(showSignInModal(true, message, afterSignIn, isBasketInitCheckout));
};

/**
 * Session timeout - allow user to sign in again (or if SSI, sign them in automatically)
 * and then execute whatever ajax call they were originally attempting
 */
var sessionTimeout = function (url, options, originalResolve, response) {
    handleTimeout(url, options, originalResolve, response);
};

/**
 * SSI expired.  The user must sign back in (and we show them an error message stating so)
 * and then execute whatever ajax call they were originally attempting
 */
var ssiExpiredSignIn = function (url, options, originalResolve, reason) {
    handleTimeout(url, options, originalResolve, response, reason.errorMessages);
};

var autoLogin = function (originalUrl, originalOptions, originalResolve, response) {
    store.dispatch(showInterstice(false));

    let refetch = require('Refetch');

    ssiApi.autoLogin().
        then(() => {
            refetch.fetch(originalUrl, originalOptions).then(originalResolve);
        }).catch(reason => {
            ssiExpiredSignIn(originalUrl, originalOptions, originalResolve, reason);
        });

    /*
     // TODO: after 17.2
     // Account.getProfile(response.profileId, true).done(function() {
     //     reinitializeOrder(true);
     // });
     */
};

/*
 * Show the signin modal and apply postponed promo after Login if an apple pay session
 *
 * Note: this is needed only on basket and checkout but needs to be on all ways of logging in on
 * those pages, thus its presence here as a universal decorator
 */
var showSignInModalWithPromoDecoration = function (
    resolve,
    reject,
    isNewUserFlow = false,
    analyticsData = {}
) {
    // Required on the method level bc/ of a circular dependency otherwise.
    const Actions = require('Actions');
    const storeLocal = require('Store');

    let decoratedResolve = function (data) {

        let applePaySession = storeLocal.getState().applePaySession;
        // TODO: Remove isActive ApplePay check when you need to enable it for any signIn
        if (applePaySession.isActive) {
            let promo = storeLocal.getState().promo;
            if (promo.afterLogin) {
                let applyPromo = require('actions/PromoActions').applyPromo;
                storeLocal.dispatch(applyPromo(promo.afterLogin, (result) => {
                    resolve(data);
                }));
            } else {
                resolve(data);
            }
        } else {
            resolve(data);
        }
    };

    storeLocal.dispatch(
        Actions.showSignInModal(true, null, decoratedResolve, isNewUserFlow, analyticsData, reject)
    );
};

/**
 * Renders the sign-in / register overlay if needed.  then redirects/calls the desired function
 *
 * Note: only checks for signed in/recognized versus anonymous, does not differentiate between
 * signed in and recognized (API call return status will handle that accordingly)
 *
 * @param {String} redirect        *TODO* Optional: path to redirect,
 *                                  else redirected to same page or home
 * @param {object} objdata         *TODO* Optional: object for storing the temporary data required
 *                                  by functionality which needs
 *                                 to be performed after registration is done
 *                                 objdata format should be : {
 *                                      sActionType : 'Loves',
 *                                      oActionData : {}
 *                                 }
 **/
// TODO: support redirect, and objdata
var requireAuthentication = function (
        requiredForRecognized = false,
        isNewUserFlow,
        analyticsData
    ) {
    //const store = require('Store');
    const validateUserStatus = require('utils/User').validateUserStatus;

    return new Promise(function (resolve, reject) {
        validateUserStatus().then(user => {
            var profileStatus = user.profileStatus;

            if (profileStatus === 0 || (profileStatus === 2 && requiredForRecognized)) {
                showSignInModalWithPromoDecoration(resolve, reject, isNewUserFlow, analyticsData);
            } else {
                resolve();
            }
        });
    });
};

// TODO THOMAS 17.4:
//  refactor various files that are using the above requireAuthentication function
//  so that those files use new decorator that calls this promise function
//  files include: ProductQuickLookMessage.c.js, AccountGreeting.c.js, InlineBasket.c.js,
//  ProductLove.c.js, RewardItem.c.js, PleaseSignIn.c.js
var requireRecognizedAuthentication = function () {
    const validateUserStatus = require('utils/User').validateUserStatus;

    return new Promise((resolve, reject) => {
        validateUserStatus().then(user => {
            var profileStatus = user.profileStatus;

            if (profileStatus === 0) {
                showSignInModalWithPromoDecoration(resolve, reject);
            } else {
                resolve();
            }
        });
    });
};

var requireLoggedInAuthentication = function () {
    const validateUserStatus = require('utils/User').validateUserStatus;

    return new Promise((resolve, reject) => {
        validateUserStatus().then(user => {
            var profileStatus = user.profileStatus;

            if (profileStatus === 0 || profileStatus === 2) {
                showSignInModalWithPromoDecoration(resolve, reject);
            } else {
                resolve();
            }
        });
    });
};


module.exports = {
    // TODO
    // sessionTimeoutAnonymous : sessionTimeoutAnonymous,
    sessionTimeout: sessionTimeout,

    // TODO
    //authenticate : authenticate,
    ssiExpiredSignIn: ssiExpiredSignIn,
    autoLogin: autoLogin,
    requireAuthentication: requireAuthentication,
    requireRecognizedAuthentication: requireRecognizedAuthentication,
    requireLoggedInAuthentication: requireLoggedInAuthentication
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Authentication.js