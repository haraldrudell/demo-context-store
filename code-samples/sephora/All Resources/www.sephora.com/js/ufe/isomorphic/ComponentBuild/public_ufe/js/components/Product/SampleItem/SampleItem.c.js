// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SampleItem = function () {};

// Added by sephora-jsx-loader.js
SampleItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const skuUtils = require('utils/Sku');

SampleItem.prototype.ctrlr = function () {
    store.setAndWatch('basket', null, () => {
        this.setState({
            isInBasket: skuUtils.isInBasket(this.props.skuId),
            isSamplesMax: this.isSamplesMax()
        });
    });
};

SampleItem.prototype.toggleHover = function () {
    if (!Sephora.isTouch) {
        this.setState({
            hover: !this.state.hover
        });
    }
};

SampleItem.prototype.isSamplesMax = function () {
    return (store.getState().basket.samples.length >= this.props.maxSampleQty);
};


// Added by sephora-jsx-loader.js
module.exports = SampleItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/SampleItem/SampleItem.c.js