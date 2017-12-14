// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EmailMeWhenInStockModal = function () {};

// Added by sephora-jsx-loader.js
EmailMeWhenInStockModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const Actions = require('Actions');
const action = require('actions/ProductActions').TYPES;
const ProductActions = require('actions/ProductActions');
const UserActions = require('actions/UserActions');
const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');
const snbApi = require('services/api/search-n-browse');
const utilityApi = require('services/api/utility');
const userUtils = require('utils/User');
const { withInterstice } = require('utils/decorators');


EmailMeWhenInStockModal.prototype.ctrlr = function () {
    this.setState({
        isOpen: false,
        subscribedEmail: '',
        showSignupBlock: true,
        showRemovalMessage: false
    });

    let user = store.getState().user;

    if (!userUtils.isAnonymous()) {
        this.setState({
            inputsDisabled: true,
            presetEmail: user.login
        });
    } else if (this.props.alreadySubscribed && user.subscribedAnonEmail) {
        this.setState({
            inputsDisabled: true,
            presetEmail: user.subscribedAnonEmail
        });
    }

    this.emailInput = null;
};

EmailMeWhenInStockModal.prototype.requestClose = function (e) {
    store.dispatch(Actions.showEmailMeWhenInStockModal(false));
    if (this.props.isQuickLook) {
        this.dispatchQuicklook();
    }
};

EmailMeWhenInStockModal.prototype.dispatchQuicklook = function () {
    let isRewardQuickLook = false;
    if (!userUtils.isAnonymous()) {
        snbApi.getProductDetails(
                data.productId, data.skuId, { addCurrentSkuToProductChildSkus: true }).
            then(data => {
                store.dispatch(Actions.updateQuickLookContent(data));
                store.dispatch(Actions.showQuickLookModal(true, isRewardQuickLook));
            });

    } else {
        store.dispatch(Actions.showQuickLookModal(true, isRewardQuickLook));
    }
};

EmailMeWhenInStockModal.prototype.handleEmailMeWhenInStock = function (e) {
    e.preventDefault();

    let subscribedEmail = this.emailInput.getValue();

    if (!this.emailInput.validateError()) {

        withInterstice(utilityApi.requestEmailNotificationForOutOfStockSku)(
                subscribedEmail, this.props.currentSku.skuId).
            then(() => {
                let user = store.getState().user;

                user.subscribedAnonEmail = subscribedEmail;

                store.dispatch(UserActions.update(user));

                this.setState({
                    inputsDisabled: false,
                    errorMessages: [],
                    message: null,
                    showSignupBlock: false,
                    subscribedEmail
                });

                //Analytics
                processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: ['event71'],
                        sku: this.props.currentSku,
                        linkName: 'Email Me When Available: Success',
                        internalCampaign: [
                            this.props.currentSku.rootContainerName,
                            this.props.currentSku.productId,
                            'email-me-when-available-success'
                        ],
                        actionInfo: 'Email Me When Available: Success'
                    }
                });
            }).
            catch(reason => {
                this.subscriptionFailure(reason);
            });
    }
};

EmailMeWhenInStockModal.prototype.subscriptionFailure = function (reason) {
    let stateObj = { inputsDisabled: false };

    if (reason.errorMessages) {
        stateObj.errorMessages = reason.errorMessages;
    }

    this.setState(stateObj);
};

EmailMeWhenInStockModal.prototype.handleRemoveEmailSubscription = function (e) {
    e.preventDefault();

    let subscribedEmail = this.emailInput.getValue();

    if (!this.emailInput.validateError()) {

        withInterstice(utilityApi.cancelEmailNotificationRequest)(
                subscribedEmail, this.props.currentSku.skuId).
            then(() => {
                this.setState({
                    inputsDisabled: false,
                    errorMessages: [],
                    message: null,
                    showSignupBlock: false,
                    showRemovalMessage: true
                });
            }).
            catch(reason => {
                this.subscriptionFailure(reason);
            });

    } else {
        this.setState({ showErrors: true });
    }
};


// Added by sephora-jsx-loader.js
module.exports = EmailMeWhenInStockModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/EmailMeWhenInStockModal/EmailMeWhenInStockModal.c.js