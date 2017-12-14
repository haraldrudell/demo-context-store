// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Swatches = function () {};

// Added by sephora-jsx-loader.js
Swatches.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const FrameworkActions = require('actions/FrameworkActions');
const ProductActions = require('actions/ProductActions');
const ProductWatcher = require('components/ProductPage/Type/ProductWatcher');
const uiUtils = require('utils/UI');

Swatches.prototype.ctrlr = function () {
    if (this.groupedSwatches && this.groupedSwatches.length) {
        this.setState({
            expandable: uiUtils.hasHorizontalScrollBar(this.groupedSwatches[0]) ||
            (this.state.refinementGroups && this.state.refinementGroups.length > 1)
        });
    }
};

Swatches.prototype.handleSkuOnClick = function (sku) {
    this.currentSkuRefinementName = sku.refinementName;
    store.dispatch(ProductActions.updateSkuInCurrentProduct(sku,
        ProductActions.SKU_UPDATE_SOURCE.SWATCHES));

    store.dispatch(FrameworkActions.updateQueryParam(ProductWatcher.SKU_ID_PARAM, [sku.skuId]));
};

Swatches.prototype.handleSkuOnMouseEnter = function (sku) {
    if (!Sephora.isTouch) {
        store.dispatch(ProductActions.hoveredSku(sku));
    }
};

Swatches.prototype.handleSkuOnMouseLeave = function () {
    if (!Sephora.isTouch) {
        store.dispatch(ProductActions.hoveredSku(null));
    }
};

Swatches.prototype.toggleExpand = function () {
    let isExpanded = !this.state.isExpanded;
    this.setState({
        isExpanded: isExpanded
    }, () => store.dispatch(ProductActions.toggleSwatches(isExpanded)));
};

Swatches.prototype.toggleRefinementGroupExpand = function (index) {
    let expandedRefinementGroups = this.state.expandedRefinementGroups;
    let isExpanded = expandedRefinementGroups[index] = !expandedRefinementGroups[index];
    this.setState({
        expandedRefinementGroups: expandedRefinementGroups
    }, () => store.dispatch(ProductActions.toggleSwatches(isExpanded)));
};


// Added by sephora-jsx-loader.js
module.exports = Swatches.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Swatches/Swatches.c.js