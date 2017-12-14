// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ShowFilters = function () {};

// Added by sephora-jsx-loader.js
ShowFilters.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var store = require('Store');
var showFilters = require('actions/ProductFilterActions').showFilters;
var uIUtils = require('utils/UI');

ShowFilters.prototype.ctrlr = function () {

};

ShowFilters.prototype.handleOnClick = function () {
	store.dispatch(showFilters(!store.getState().productFilters.showFilters));
	// TODO: This will not be necessary once the framework supports nested components
	uIUtils.toggleMain();
};

// Added by sephora-jsx-loader.js
module.exports = ShowFilters.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersMW/ShowFilters/ShowFilters.c.js