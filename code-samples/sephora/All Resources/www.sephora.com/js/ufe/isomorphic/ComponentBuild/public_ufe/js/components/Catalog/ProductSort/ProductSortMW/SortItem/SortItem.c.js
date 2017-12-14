// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SortItem = function () {};

// Added by sephora-jsx-loader.js
SortItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var watch = require('redux-watch');
var store = require('Store');

SortItem.prototype.ctrlr = function () {
    let sortWatch = watch(store.getState, 'productSort');
    store.subscribe(sortWatch((newVal, oldVal, objectPath) => {
        if(newVal.currentSort === this.props.options.sortParam){
            this.setState({isActive : true});
        } else {
            this.setState({isActive: false});
        }
    }));
};

SortItem.prototype.handleOnClick = function() {
    this.props.handleSort(this.props.options.sortParam);
    this.props.closeMenu();
};


// Added by sephora-jsx-loader.js
module.exports = SortItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductSort/ProductSortMW/SortItem/SortItem.c.js