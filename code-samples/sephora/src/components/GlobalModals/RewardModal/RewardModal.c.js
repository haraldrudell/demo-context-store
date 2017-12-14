// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RewardModal = function () {};

// Added by sephora-jsx-loader.js
RewardModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const showRewardModal = require('Actions').showRewardModal;
const basketUtils = require('utils/Basket');
const fetchProfileRewards = require('actions/RewardActions').fetchProfileRewards;
const userUtils = require('utils/User');

RewardModal.prototype.ctrlr = function () {
    this.setState({
        biPoints: basketUtils.getAvailableBiPoints(),
    });

    let rewards = store.getState().rewards;

    if (!!rewards) {
        store.dispatch(fetchProfileRewards());
    }

    let watchBasket = watch(store.getState, 'basket');
    store.subscribe(watchBasket(() => {
        this.setState({
            biPoints: basketUtils.getAvailableBiPoints()
        });
    }));
};

RewardModal.prototype.isDone = function (e) {
    store.dispatch(showRewardModal(false));
};


// Added by sephora-jsx-loader.js
module.exports = RewardModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/RewardModal/RewardModal.c.js