// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CallToActions = function () {};

// Added by sephora-jsx-loader.js
CallToActions.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const ProductActions = require('actions/ProductActions');
const SearchActions = require('actions/SearchActions');
const urlUtils = require('utils/Url');
const UI = require('utils/UI');
const LocationUtils = require('utils/Location.js');

CallToActions.prototype.ctrlr = function () {
    let watchCustomSetsChoices = watch(store.getState, 'product.customSetsChoices');
    store.subscribe(watchCustomSetsChoices(customSetsChoices => {
        this.setState({
            customSetsChoices: customSetsChoices
        });
    }));
};

CallToActions.prototype.openCustomSets = function () {
    urlUtils.updateURL(null, LocationUtils.PAGES.CUSTOM_SETS_HASH, false);
    UI.scrollToTop();
    store.dispatch(SearchActions.hideSearch());
    store.dispatch(ProductActions.toggleCustomSets(true));
};


// Added by sephora-jsx-loader.js
module.exports = CallToActions.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/CallToActions.c.js