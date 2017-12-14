// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ColorRefinement = function () {};

// Added by sephora-jsx-loader.js
ColorRefinement.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
ColorRefinement.prototype.ctrlr = function () {
};

ColorRefinement.prototype.handleOnClick = function (e, value, checked) {
	e.preventDefault();

	if (typeof this.props.handleOnClick === 'function') {
		let options = {
			checked: !checked,
			value: value
		};

		this.props.handleOnClick(options);
	}
};

// Added by sephora-jsx-loader.js
module.exports = ColorRefinement.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxFS/ColorsWrapper/ColorRefinement/ColorRefinement.c.js