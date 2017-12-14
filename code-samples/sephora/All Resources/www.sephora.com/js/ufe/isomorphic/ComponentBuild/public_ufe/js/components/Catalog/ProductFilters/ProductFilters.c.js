// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductFilters = function () {};

// Added by sephora-jsx-loader.js
ProductFilters.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var update = require('react-addons-update');
var watch = require('redux-watch');
var store = require('Store');
var urlUtils = require('utils/Url');
var updateRefinements = require('actions/ProductFilterActions').updateRefinements;
var updateFilters = require('actions/ProductFilterActions').updateFilters;
var addFilter = require('actions/ProductFilterActions').addFilter;
var removeFilter = require('actions/ProductFilterActions').removeFilter;
var fetchProducts = require('actions/ProductGridActions').fetchProducts;

ProductFilters.prototype.ctrlr = function () {
	let self = this;
	let w = watch(store.getState, 'productFilters');

	store.subscribe(w((newVal) => {
		self.setState(update(self.state, {
			refinements: {$set: newVal.refinements},
			isFiltered: {$set: newVal.isFiltered}
		}));
	}));
};

ProductFilters.prototype.componentWillMount = function () {
	let refinements = this.props.refinements || [];
	let filters = urlUtils.getParamsByName('ref') || [];

	this.setState(update(this.state, {
		refinements: {$set: refinements},
		isFiltered: {$set: filters.length !== 0}
	}));

	store.dispatch(updateRefinements(refinements));
};

ProductFilters.prototype.clearAllFilters = function () {
	if (store.getState().productFilters.filters.length) {
		store.dispatch(updateFilters([]));
		store.dispatch(fetchProducts());
	}
};

ProductFilters.prototype.selectFilter = function (options) {
	options.checked ? store.dispatch(addFilter(options.value)) : store.dispatch(removeFilter(options.value));
	store.dispatch(fetchProducts());
};

ProductFilters.prototype.isFilterSelected = function (filter) {
	var filters = store.getState().productFilters.filters;
	return (filters.indexOf(filter.toString()) !== -1);
};

ProductFilters.prototype.clearRefinementsBox = function (filters) {
	filters.map(filter => store.dispatch(removeFilter(filter)));
	store.dispatch(fetchProducts());
};


// Added by sephora-jsx-loader.js
module.exports = ProductFilters.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFilters.c.js