// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CatalogHeader = function () {};

// Added by sephora-jsx-loader.js
CatalogHeader.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var update = require('react-addons-update');
var watch = require('redux-watch');
var store = require('Store');

CatalogHeader.prototype.ctrlr = function () {
	let self = this;
	let wProductGrid = watch(store.getState, 'productGrid.totalProducts');

	store.subscribe(wProductGrid((newVal) => {
		self.setState(update(self.state, {
			totalProducts: {$set: newVal}
		}));
	}));
};

CatalogHeader.prototype.componentWillMount = function () {
	this.setState(update(this.state, {
		totalProducts: {$set: store.getState().productGrid.totalProducts},
		displayName: {$set: this.props.displayName}
	}));
};

// Added by sephora-jsx-loader.js
module.exports = CatalogHeader.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/CatalogHeader/CatalogHeader.c.js