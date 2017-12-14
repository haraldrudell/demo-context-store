// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductSort = function () {};

// Added by sephora-jsx-loader.js
ProductSort.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var store = require('store/Store'),
    fetchProducts = require('actions/ProductGridActions').fetchProducts,
    updateProductSort = require('actions/Actions').updateProductSort,
    urlUtils = require('utils/Url'),
    watch = require('redux-watch');

ProductSort.prototype.ctrlr = function(){
    let sortWatch = watch(store.getState, 'productSort');

    store.subscribe(sortWatch((newVal) => {
        store.dispatch(fetchProducts());
    }));
};

ProductSort.prototype.handleSort = function(option) {
    let requestedSort = option;
    store.dispatch(updateProductSort(requestedSort));
};


// Added by sephora-jsx-loader.js
module.exports = ProductSort.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSort.c.js