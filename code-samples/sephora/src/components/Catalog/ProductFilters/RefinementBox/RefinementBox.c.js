// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RefinementBox = function () {};

// Added by sephora-jsx-loader.js
RefinementBox.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var update = require('react-addons-update');
var store = require('Store');

RefinementBox.prototype.ctrlr = function () {
};

RefinementBox.prototype.selectFilter = function (options) {
	if (typeof this.props.selectFilter === 'function') {
		this.setState(update(this.state, {
			filters: options.checked ?
			{$push: [options.value]} :
			{$splice: [[this.state.filters.indexOf(options.value), 1]]}
		}), this.props.selectFilter(options));
	}
};

RefinementBox.prototype.componentWillMount = function () {
	var filters = store.getState().productFilters.filters;

	filters = this.props.values.filter(function (filter) {
		if (filter.refinementValueId) {
			return filters.indexOf(filter.refinementValueId.toString()) !== -1;
		}
	});

	filters = filters.map(function (filter) {
		return filter.refinementValueId;
	});

	this.setState(update(this.state, {
		filters: {$set: filters}
	}));
};

RefinementBox.prototype.componentWillReceiveProps = function (nextProps) {
	if (!nextProps.isFiltered) {
		this.setState(update(this.state, {
			filters: {$set: []}
		}));
	}
};

RefinementBox.prototype.clearRefinementsBox = function () {
	if (typeof this.props.clearRefinementsBox === 'function') {
		let filters = this.state.filters;

		this.setState(update(this.state, {
			filters: {$set: []}
		}), this.props.clearRefinementsBox(filters));
	}
};

// Added by sephora-jsx-loader.js
module.exports = RefinementBox.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBox.c.js