// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ClearAllFilters = function () {};

// Added by sephora-jsx-loader.js
ClearAllFilters.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
ClearAllFilters.prototype.ctrlr = function () {
};

ClearAllFilters.prototype.handleOnClick = function () {
	if (typeof this.props.handleOnClick === 'function') {
		this.props.handleOnClick();
	}
};

// Added by sephora-jsx-loader.js
module.exports = ClearAllFilters.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/ProductFiltersFS/ClearAllFilters/ClearAllFilters.c.js