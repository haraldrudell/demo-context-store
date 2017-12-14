// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Flash = function () {};

// Added by sephora-jsx-loader.js
Flash.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const Actions = require('actions/Actions');
const watch = require('redux-watch');
const skuUtils = require('utils/Sku');
const TermsAndConditionsActions = require('actions/TermsAndConditionsActions');
const profileApi = require('services/api/profile');
const OrderUtils = require('utils/Order');
const userActions = require('actions/UserActions');
const checkoutApi = require('services/api/checkout');
const { withInterstice } = require('utils/decorators');
const snbApi = require('services/api/search-n-browse');


Flash.prototype.ctrlr = function () {
    if (this.props.flash.subscriptions && this.props.flash.subscriptions.length) {
        withInterstice(checkoutApi.getOrderDetails)
            (this.props.flash.subscriptions[0].templateOrderId).
        then(data => {
            this.setFlashSubscriptionInfo(data);
        });

    } else if (!this.props.flash.isActive) {
        snbApi.getProductDetails(
                skuUtils.flashProdId, null, { addCurrentSkuToProductChildSkus: true }).
            then(data => {
                this.setFlashSku(data);
            });
    }
};

Flash.prototype.setFlashSubscriptionInfo = function (data) {

    //set flash payment info
    let payment = OrderUtils.getPaymentDisplayInfo(data.paymentGroups);

    this.setState({
        isAutoRenew: true,
        flashPaymentInfo: payment
    });

};

Flash.prototype.setFlashSku = function (product) {
    let basketWatch = watch(store.getState, 'basket');
    this.setState({
        sku: product.currentSku,
        isInBasket: skuUtils.isInBasket(product.currentSku.skuId)
    });

    store.subscribe(basketWatch((newVal) => {
        this.setState({ isInBasket: skuUtils.isInBasket(product.currentSku.skuId) });
    }));
};

Flash.prototype.showCancelFlashModal = function () {

    //variable declaration here for clarity
    let title = 'Cancel Sephora FLASH Auto Renewal';
    let message = `<p>You can cancel your Sephora FLASH subscription auto renewal.
        Your card will not be charged on the renewal date.</p>
         <p>You will still get FREE 2-day shipping until the end of your
         current subscription, <b>${this.props.flash.endDate}</b>.</p>`;
    let confirmButtonText = 'Cancel Auto Renew';
    let callback = this.cancelFlashSubscription;
    let hasCancelButton = true;
    let cancelButtonText = 'Nevermind';
    let isMessageHtml = true;
    let confirmMsgObj = {
        title: 'Cancel Sephora FLASH Auto Renewal',
        message: `<p>Your Sephora FLASH subscription auto-renewal has been canceled.</p>
         <p>Your shipping benefits will end of <b>${this.props.flash.endDate}</b>.</p>`
    };

    store.dispatch(
        Actions.showInfoModal(
            true,
            title,
            message,
            confirmButtonText,
            callback,
            hasCancelButton,
            cancelButtonText,
            isMessageHtml,
            confirmMsgObj
        )
    );
};

Flash.prototype.cancelFlashSubscription = function () {
    profileApi.cancelSubscription(store.getState().user.profileId, 'flash').then(json => {
        this.setState({ isAutoRenew: false });
    });
};

Flash.prototype.openTermsAndConditions = function () {
    store.dispatch(
        TermsAndConditionsActions.showModal(true, 18100038, 'Sephora FLASH Terms & Conditions')
    );
};

Flash.prototype.enrollFlashForRouge = function () {
    let data = {
        fragmentForUpdate: 'FLASH',
        isAcceptTerms: true
    };

    store.dispatch(
        userActions.updateUserFragment(
            data,
            this.updateFlashStatus
        )
    );
};

Flash.prototype.updateFlashStatus = function () {
    store.dispatch(userActions.getUserFull());
};


// Added by sephora-jsx-loader.js
module.exports = Flash.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Subscriptions/Flash/Flash.c.js