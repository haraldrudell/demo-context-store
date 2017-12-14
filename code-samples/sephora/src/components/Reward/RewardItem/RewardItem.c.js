// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RewardItem = function () {};

// Added by sephora-jsx-loader.js
RewardItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const watch = require('redux-watch');
const store = require('Store');
const auth = require('utils/Authentication');
const skuUtils = require('utils/Sku');

RewardItem.prototype.ctrlr = function () {
    /**
     * Watch any changes on rewards Store
     * If any status of reward on the page has changed,
     * it means that every other reward should react on it.
     * (possibly, user doesn't have enough points for current one,
     * or reward now is in basket already)
     */

    store.setAndWatch('basket', null, () => {
        this.setState({
            isInBasket: skuUtils.isInBasket(this.props.skuId),
            isRewardDisabled: skuUtils.isRewardDisabled(this.props)
        });
    });
};

RewardItem.prototype.toggleHover = function () {
    if (!Sephora.isTouch) {
        this.setState({ hover: !this.state.hover });
    }
};

RewardItem.prototype.signInHandler = function (e) {
    e.preventDefault();
    auth.requireAuthentication();
};



// Added by sephora-jsx-loader.js
module.exports = RewardItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Reward/RewardItem/RewardItem.c.js