// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RefinementItem = function () {};

// Added by sephora-jsx-loader.js
RefinementItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
// jscs:disable
RefinementItem.prototype.ctrlr = function () {
};

RefinementItem.prototype.handleOnChange = function (e) {
	if (typeof this.props.handleOnChange === 'function') {
		let options = {
			checked: e.target.checked,
			value: e.target.value
		};

		this.props.handleOnChange(options);
	}
};

RefinementItem.prototype.isChecked = function (value) {
	if (typeof this.props.isChecked === 'function') {
		return this.props.isChecked(value);
	}
};


// Added by sephora-jsx-loader.js
module.exports = RefinementItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementItem/RefinementItem.c.js