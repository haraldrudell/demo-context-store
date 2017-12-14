// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MobileRewardsInBasket = function () {};

// Added by sephora-jsx-loader.js
MobileRewardsInBasket.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');
const fetchProfileRewards = require('actions/RewardActions').fetchProfileRewards;
const skuUtils = require('utils/Sku');
const showRewardModal = require('Actions').showRewardModal;
const basketUtils = require('utils/Basket');

MobileRewardsInBasket.prototype.ctrlr = function () {
    store.setAndWatch('basket', null, (value) => {
        this.setRewardsInformation(value.basket);
    });
};

MobileRewardsInBasket.prototype.setRewardsInformation = function (basket) {
    this.setState({
        availablePoints: basketUtils.getAvailableBiPoints(),
        rewards: basket.rewards
    });
};

MobileRewardsInBasket.prototype.openRewards = function () {

    if (Sephora.isMobile()) {
        store.dispatch(showRewardModal(true));
    }
};



// Added by sephora-jsx-loader.js
module.exports = MobileRewardsInBasket.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Rewards/MobileRewardsInBasket/MobileRewardsInBasket.c.js