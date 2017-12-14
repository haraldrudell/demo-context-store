// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductSwatchGroup = function () {};

// Added by sephora-jsx-loader.js
ProductSwatchGroup.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const changeCurrentSku = require('actions/ProductActions').changeCurrentSku;
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

let changeSku = function (sku) {
    store.dispatch(changeCurrentSku(sku));
};

ProductSwatchGroup.prototype.ctrlr = function () {
    let currentSkuWatch = watch(store.getState, 'product');

    // toggledSku defaults to currentSku prop from parent's component props.
    this.setState({
        toggledSku: this.props.currentSku
    });

    store.subscribe(currentSkuWatch((newVal, oldVal, objectPath) => {
        this.setState({
            currentSku: newVal.currentSku,
            previousSku: oldVal.currentSku
        });
    }));
};

ProductSwatchGroup.prototype.handleSkuOnClick = function (sku) {
    changeSku(sku);

    /**
     * toggledSku stores only the most recently clicked swatch,
     * and is used exclusively to validate which productSwatchItem
     * receives the "active" UI class.
     */
    this.setState({
        toggledSku: sku
    });

    //Analytics
    processEvent.preprocess.commonInteractions(
        {
            actionInfo: 'swatch_click',
            bindingMethods: [require('analytics/bindings/pages/all/swatchClickEvent')],
            context: this.props.analyticsContext,
            eventStrings: ['event71'],
            skuId: sku.skuId,
            linkName: 'swatch_click'
        }
    );
};

ProductSwatchGroup.prototype.handleSkuOnMouseEnter = function (sku) {
    if (!Sephora.isTouch) {
        changeSku(sku);
    }
};

ProductSwatchGroup.prototype.handleSkuOnMouseLeave = function () {
    if (!Sephora.isTouch) {
        changeSku(this.state.toggledSku);
    }
};


// Added by sephora-jsx-loader.js
module.exports = ProductSwatchGroup.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductSwatchGroup/ProductSwatchGroup.c.js