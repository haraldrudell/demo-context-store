// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketTargeters = function () {};

// Added by sephora-jsx-loader.js
BasketTargeters.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const basketActions = require('actions/BasketActions');
const userActions = require('actions/UserActions');
const bccUtil = require('utils/BCC');
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');

BasketTargeters.prototype.BASKET_TARGETERS = {
    FLASH: '/atg/registry/RepositoryTargeters/Sephora/BasketFlashBannerTargeter',
    GIFTCARD: '/atg/registry/RepositoryTargeters/Sephora/BasketGiftCardTargeter'
};

BasketTargeters.prototype.animationDuration = 500;

BasketTargeters.prototype.ctrlr = function () {
    bccUtil.processTargeters([this.BASKET_TARGETERS.FLASH, this.BASKET_TARGETERS.GIFTCARD],
        (result, name) => {
            let newState = {};
            newState[name] = result;
            this.setState(newState);
        });
    store.subscribe(watch(store.getState, 'basket')(newVal => {
        setTimeout(() => {
            this.forceUpdate();
        }, this.animationDuration);
    }));
};

BasketTargeters.prototype.addFlashToBasket = function (e) {
    e.preventDefault();
    if (userUtils.getBiStatus() === userUtils.types.ROUGE) {
        store.dispatch(userActions.updateUserInformation({

            fragmentForUpdate: 'flash',
            isAcceptTerms: true
        }, this.onEnrollRougeInFlash, (response) => {
            store.dispatch(basketActions.showError({
                internalError: response.errorMessages.join(' ')
            }));
        },
        anaConsts.PAGE_NAMES.BASKET));
    } else {
        store.dispatch(basketActions.addToBasket({
            skuId: skuUtils.IDs.FLASH,
            type: skuUtils.skuTypes.FLASH
        }, 1, this.onAddToBasket,
            anaConsts.CONTEXT.ADD_FLASH_BASKET_BANNER));
    }
};

BasketTargeters.prototype.addGiftCardToBasket = function (e) {
    e.preventDefault();
    store.dispatch(basketActions.addToBasket({
        skuId: skuUtils.IDs.GC,
        type: skuUtils.skuTypes.GC
    }, 1, this.onAddToBasket,
    anaConsts.PAGE_NAMES.BASKET));
};

BasketTargeters.prototype.onAddToBasket = function () {
    this.setState({
        animatePopdownStart: true
    });
};

BasketTargeters.prototype.onEnrollRougeInFlash = function () {
    this.setState({
        showRougeCopyText: true
    }, () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: anaConsts.LinkData.ENROLL_IN_FLASH,
                eventStrings: [anaConsts.Event.EVENT_71],
                actionInfo: anaConsts.CAMPAIGN_STRINGS.ENROLL_IN_FLASH,
                internalCampaign: anaConsts.CAMPAIGN_STRINGS.ENROLL_IN_FLASH
            }
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = BasketTargeters.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketTargeters/BasketTargeters.c.js