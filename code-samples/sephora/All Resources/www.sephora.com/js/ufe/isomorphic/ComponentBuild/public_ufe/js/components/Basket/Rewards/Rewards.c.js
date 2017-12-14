// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Rewards = function () {};

// Added by sephora-jsx-loader.js
Rewards.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');
const userUtils = require('utils/User');

Rewards.prototype.ctrlr = function () {
    store.setAndWatch('rewards', null, (valueWrapper) => {
        let newRewards = valueWrapper.rewards.rewards;
        if (newRewards) {
            this.setRewards(newRewards);
        }
    });
};

Rewards.prototype.setRewards = function (rewards) {
    let rewardGroups = {};
    let biRewards = rewards.biRewardGroups || {};
    let complimentaryRewards = rewards.complimentary;

    if (complimentaryRewards && complimentaryRewards.length) {
        Object.assign(
            rewardGroups,
            { Complimentary: complimentaryRewards },
            biRewards
        );
    } else {
        Object.assign(rewardGroups, biRewards);
    }

    let biRewardKeys = Object.keys(rewardGroups);
    let currentTab = (biRewardKeys.length) ? biRewardKeys[0] : '';

    this.setState({
        rewardGroups: rewardGroups,
        currentTab: currentTab 
    });
};

Rewards.prototype.showCurrentTabRewards = function (index) {
    this.setState({ currentTab: index });
};


// Added by sephora-jsx-loader.js
module.exports = Rewards.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/Rewards/Rewards.c.js