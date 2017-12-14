// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Lists = function () {};

// Added by sephora-jsx-loader.js
Lists.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const DateUtils = require('utils/Date');
const userUtils = require('utils/User');
const watch = require('redux-watch');
const showBiRegisterModal = require('Actions').showBiRegisterModal;
const { ensureUserIsAtLeastRecognized } = require('utils/decorators');
const biApi = require('services/api/beautyInsider');
const ITEMS_QTY = 12;

Lists.prototype.ctrlr = function (user) {
    this.getPurchaseHistory();
};

Lists.prototype.getPurchaseHistory = function () {
    if (!userUtils.isBI()) {
        this.setState({ userIsBi: false });
    } else {
        let user = store.getState('user').user;
        biApi.getPurchaseHistory(user.profileId)
            .then(purchaseHistory => {
                if (purchaseHistory.purchasedGroups.length) {
                    let purchase = purchaseHistory.purchasedGroups[0];
                    let purchasedItems =
                            purchase.purchasedItems.slice(0, ITEMS_QTY);
                    this.setState({
                        pastPurchase: {
                            purchaseDateStore:
                                DateUtils.getLongDate(
                                    new Date(purchase.transactionDate)) +
                                    ' - ' + purchase.storeName,
                            items: purchasedItems
                        },
                        userIsBi: true
                    });
                } else {
                    this.setState({
                        pastPurchase: { items: [] },
                        userIsBi: true
                    });
                }
            })
            .catch(error => {
                this.setState({
                    pastPurchase: { items: [] },
                    userIsBi: true
                });
            });
    }
};

Lists.prototype.biRegisterHandler = function () {
    // sign up for beauty insider modal needs to be implemented
    store.dispatch(showBiRegisterModal(true));

    //call getPurchaseHistory after user becomes beautyInsider
    let userBIWatch = watch(store.getState, 'user.beautyInsiderAccount');
    store.subscribe(userBIWatch((newVal) => {
        this.getPurchaseHistory();
    }));
};

Lists = ensureUserIsAtLeastRecognized(Lists);


// Added by sephora-jsx-loader.js
module.exports = Lists.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/Lists/Lists.c.js