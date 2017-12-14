// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Play = function () {};

// Added by sephora-jsx-loader.js
Play.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const Actions = require('actions/Actions');
const DateUtils = require('utils/Date');
const profileApi = require('services/api/profile');
const utilityApi = require('services/api/utility');
const userActions = require('actions/UserActions');
const OrderUtils = require('utils/Order');
const checkoutApi = require('services/api/checkout');
const UrlUtils = require('utils/Url');
const {
 withInterstice, requireSignedInUser 
} = require('utils/decorators');


Play.prototype.ctrlr = function (user) {

    if (this.props.play.subscriptions &&
        this.props.play.subscriptions.length) {

        withInterstice(checkoutApi.getOrderDetails)
            (this.props.play.subscriptions[0].templateOrderId).
        then(data => {
            this.setPlaySubscriptionInfo(data);
        });

        profileApi.getPlayEmailPreferences(user.profileId).then(playEmailPrefs => {
            this.playEmailPrefs = playEmailPrefs;
            this.setState({ isSubscribedToEmail: playEmailPrefs.subScribeToEmails });
        });

        utilityApi.getSubscriptionCancelReasons().then(cancelOptions => {
            this.setState({ cancelOptions: cancelOptions });
        });
    }
};

Play.prototype.setPlaySubscriptionInfo = function (data) {

    //set play payment info
    let payment = OrderUtils.getPaymentDisplayInfo(data.paymentGroups);
    let billingAddress = OrderUtils.getBillingAddressInfo(data.paymentGroups);

    //set play address info
    let shippingAddress = OrderUtils.getShippingAddressInfo(data.shippingGroups);

    //check if play order is pending or editable
    let isPlayEditable = data.header.isPlaySubscriptionOrderEditable;

    //set play billing date range using next billing date and last billing date
    let billingDate = DateUtils.getPlayBillingDateString(
        data.header.nextBillingDate,
        data.header.lastBillingDate
    );

    this.setState({
        playPayment: payment,
        billingDate: billingDate,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        isPlayEditable: isPlayEditable
    });
};

Play.prototype.updatePlayEmailSubscription = function () {
    this.playEmailPrefs.subScribeToEmails = this.state.isSubscribedToEmail;

    let data = {
        fragmentForUpdate: 'EMAIL_SUBSCRIPTION',
        emailSubscriptionInfo: this.playEmailPrefs
    };

    store.dispatch(userActions.updateUserFragment(data, this.setEmailConfirmMsg));
};

Play.prototype.setEmailConfirmMsg = function () {
    let confirmMsg = this.state.isSubscribedToEmail ?
        'You are subscribed to PLAY! by SEPHORA emails' :
        'You are unsubscribed from PLAY! by SEPHORA emails';

    this.setState({ playEmailConfirmMsg: confirmMsg });
};

Play.prototype.updateShippingAddress = function () {
    profileApi.updatePlaySubscription(this.props.play.subscriptions[0].templateOrderId).
        then(json => {
            let redirectUrl = Sephora.isMobile() ? '/checkout/shipping' : '/checkout/shipaddress';
            UrlUtils.redirectTo(redirectUrl);
        });
};

Play.prototype.updateBillingAddress = function () {
    profileApi.updatePlaySubscription(this.props.play.subscriptions[0].templateOrderId).
        then(json => {
            let redirectUrl = Sephora.isMobile() ? '/checkout/payments' : '/checkout/payment';
            UrlUtils.redirectTo(redirectUrl);
        });
};

Play.prototype.cancelPlaySubscription = function () {
    profileApi.cancelSubscription(store.getState().user.profileId, 'play').then(json => {
        this.setState({
            isSubscribed: false,
            openCancelModal: false
        });

        store.dispatch(
            Actions.showInfoModal(
                true,
                'PLAY! by SEPHORA Cancelled',
                'Your subscription to PLAY! by SEPHORA has been cancelled.',
                'Done'
            )
        );

    });
};

Play = requireSignedInUser(Play);


// Added by sephora-jsx-loader.js
module.exports = Play.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Subscriptions/Play/Play.c.js