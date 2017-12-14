// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Reward = function () {};

// Added by sephora-jsx-loader.js
Reward.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const skuUtils = require('utils/Sku');

Reward.prototype.ctrlr = function () {
    let skuPoints = skuUtils.getBiPoints(this.props.currentProduct.currentSku);

    // Check that user has enough points to acquire reward
    store.setAndWatch('user', null, data => {
        let points;
        let user = data.user;
        if (user && user.beautyInsiderAccount) {
            points = user.beautyInsiderAccount.promotionPoints;
            if (points >= skuPoints) {
                this.setState({
                    disabled: false,
                    userReady: true
                });
            } else {
                this.setState({
                    userReady: true
                });
            }
        }

    });
};


// Added by sephora-jsx-loader.js
module.exports = Reward.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/Type/Reward/Reward.c.js