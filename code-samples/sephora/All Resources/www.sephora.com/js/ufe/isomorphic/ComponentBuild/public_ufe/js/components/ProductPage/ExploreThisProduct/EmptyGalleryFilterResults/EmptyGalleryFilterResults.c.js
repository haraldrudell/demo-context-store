// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EmptyGalleryFilterResults = function () {};

// Added by sephora-jsx-loader.js
EmptyGalleryFilterResults.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProductActions = require('actions/ProductActions');

EmptyGalleryFilterResults.prototype.reset = function () {
    store.dispatch(ProductActions.resetGalleryFilters());
};


// Added by sephora-jsx-loader.js
module.exports = EmptyGalleryFilterResults.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ExploreThisProduct/EmptyGalleryFilterResults/EmptyGalleryFilterResults.c.js