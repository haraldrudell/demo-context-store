// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RewardSampleQuickLookModal = function () {};

// Added by sephora-jsx-loader.js
RewardSampleQuickLookModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const watch = require('redux-watch');
const store = require('Store');
const skuUtils = require('utils/Sku');

RewardSampleQuickLookModal.prototype.ctrlr = function () {
    let basketWatch = watch(store.getState, 'basket');
    this.setState({
        isInBasket: skuUtils.isInBasket(this.props.currentSku.skuId),
        isRewardDisabled: skuUtils.isRewardDisabled(this.props.currentSku) 
    });

    store.subscribe(basketWatch((newVal) => {
        this.setState({
            isInBasket: skuUtils.isInBasket(this.props.currentSku.skuId),
            isRewardDisabled: skuUtils.isRewardDisabled(this.props.currentSku) 
        });
    }));
};



// Added by sephora-jsx-loader.js
module.exports = RewardSampleQuickLookModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/RewardSampleQuickLookModal/RewardSampleQuickLookModal.c.js