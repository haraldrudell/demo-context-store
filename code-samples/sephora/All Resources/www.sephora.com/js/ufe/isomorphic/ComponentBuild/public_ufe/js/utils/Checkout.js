const LegacyStorage = require('utils/localStorage/LegacyMW');
const store = require('Store');
const urlUtils = require('utils/Url');
const uiUtils = require('utils/UI');
const basketUtils = require('utils/Basket');
const basketActions = require('actions/BasketActions');
const processEvent = require('analytics/processEvent');
const anaConstants = require('analytics/constants');
const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError');
const userUtils = require('utils/User');
const checkoutApi = require('services/api/checkout');
const { withInterstice } = require('utils/decorators');


let orderMergedMsgViewed = false;


// Initializing checkout is a mandatory API operation of switching current order
// to its new `checkout' status. It's not possible to start a checkout process
// without initializing an order first.

function initializeCheckout(options = {}) {

    let {
        isPaypalFlow = false,
        isApplePayFlow = false,
        user = null
    } = options;

    let data = {};
    let userData = (user ? user : store.getState().user) || {};

    let isAnonymousCheckout = !!userData.isNewUserFlow;

    if (isAnonymousCheckout) {
        data.email = userData.userName;
    } else {
        data.orderId = basketUtils.getOrderId();
        data.profileId = userUtils.getProfileId();
    }

    data.isPaypalFlow = !!isPaypalFlow;
    data.isApplePayFlow = !!isApplePayFlow;


    let promise;

    if (isAnonymousCheckout) {
        promise = withInterstice(checkoutApi.initializeAnonymousCheckout)(data);
    } else {
        promise = withInterstice(checkoutApi.initializeCheckout)(data);
    }

    return promise;
}

function initOrderSuccess() {
    // To keep legacy Play/Regular Checkout flow alive
    if (Sephora.isMobile()) {
        LegacyStorage.deleteLegacyJStorageItem('lastOrderInitId');
        LegacyStorage.deleteLegacyJStorageItem('playUpdateOrderId');
    }

    let mergedBasket = store.getState().basket &&
        store.getState().basket.error &&
        store.getState().basket.error.orderMergedMsg;
    if (orderMergedMsgViewed || !mergedBasket) {
        urlUtils.redirectTo('/checkout');
    } else {
        orderMergedMsgViewed = true;
        uiUtils.scrollToTop();
        uiUtils.unlockBackgroundPosition();
    }
}

function initOrderFailure(response) {

    let itemLevelErrors = basketUtils.catchItemLevelErrors(response);
    let basketLevelErrors = itemLevelErrors ? null : {
        internalError: response.errorMessages.join(' ')
    };
    store.dispatch(basketActions.showError(basketLevelErrors, itemLevelErrors));

    store.dispatch(basketActions.refreshBasket(itemLevelErrors ? response : null));

    processEvent.process(anaConstants.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: linkTrackingError,
            errorMessages: response.errorMessages,
            eventStrings: [
                anaConstants.Event.EVENT_71
            ],
            linkName: 'error',
            specificEventName: 'basket_checkout_button_error'
        }
    });
}

module.exports = {
    initializeCheckout,
    initOrderSuccess,
    initOrderFailure
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Checkout.js