// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductSortFS = function () {};

// Added by sephora-jsx-loader.js
ProductSortFS.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var store = require('Store');
var watch = require('redux-watch');

ProductSortFS.prototype.ctrlr = function () {
    let sortWatch = watch(store.getState, 'productSort');
    store.subscribe(sortWatch((newVal, oldVal, objectPath) => {
        this.setState({
            currentSort: newVal.currentSort
        });
    }));
};

ProductSortFS.prototype.handleOnChange = function (e) {
    let requestedSort = e.target.value;
    this.props.handleSort(requestedSort);
};


// Added by sephora-jsx-loader.js
module.exports = ProductSortFS.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSortFS/ProductSortFS.c.js