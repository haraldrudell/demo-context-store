// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductFiltersMW = function () {};

// Added by sephora-jsx-loader.js
ProductFiltersMW.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var update = require('react-addons-update');
var watch = require('redux-watch');
var store = require('Store');
var showFilters = require('actions/ProductFilterActions').showFilters;
var uIUtils = require('utils/UI');

ProductFiltersMW.prototype.ctrlr = function () {
	let self = this;
	let wProductFilters = watch(store.getState, 'productFilters.showFilters');
	let wProductGrid = watch(store.getState, 'productGrid.totalProducts');

	store.subscribe(wProductFilters((newVal) => {
		self.setState(update(self.state, {
			showFilters: {$set: newVal}
		}));
	}));

	store.subscribe(wProductGrid((newVal) => {
		self.setState(update(self.state, {
			totalProducts: {$set: newVal}
		}));
	}));
};

ProductFiltersMW.prototype.toggleShowFilters = function (e) {
	e.preventDefault();
	store.dispatch(showFilters(!store.getState().productFilters.showFilters));
	// TODO: This will not be necessary once the framework supports nested components
	uIUtils.toggleMain();
};

ProductFiltersMW.prototype.clearAllFilters = function () {
	if (typeof this.props.clearAllFilters === 'function') {
		this.props.clearAllFilters();
	}
};

// Added by sephora-jsx-loader.js
module.exports = ProductFiltersMW.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersMW/ProductFiltersMW.c.js