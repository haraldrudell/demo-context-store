// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RefinementBoxMW = function () {};

// Added by sephora-jsx-loader.js
RefinementBoxMW.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var update = require('react-addons-update');

RefinementBoxMW.prototype.ctrlr = function () {

};

RefinementBoxMW.prototype.openRefinement = function () {
	this.setState(update(this.state, {
		isOpen: {$set: !this.state.isOpen}
	}));
};

// Added by sephora-jsx-loader.js
module.exports = RefinementBoxMW.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductFilters/RefinementBox/RefinementBoxMW/RefinementBoxMW.c.js