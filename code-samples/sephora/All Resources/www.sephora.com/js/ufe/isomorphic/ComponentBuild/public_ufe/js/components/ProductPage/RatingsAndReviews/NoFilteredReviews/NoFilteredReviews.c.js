// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var NoFilteredReviews = function () {};

// Added by sephora-jsx-loader.js
NoFilteredReviews.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const ProductActions = require('actions/ProductActions');
const Filters = require('utils/Filters');
const DEFAULT_FILTER = { [Filters.REVIEW_FILTERS_TYPES.SORT]: [Filters.REVIEW_SORT_TYPES[0]] };
const forceReset = true;

NoFilteredReviews.prototype.reset = function () {
    store.dispatch(ProductActions.applyReviewFilters(DEFAULT_FILTER, forceReset));
};


// Added by sephora-jsx-loader.js
module.exports = NoFilteredReviews.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/NoFilteredReviews/NoFilteredReviews.c.js