// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var NoReviews = function () {};

// Added by sephora-jsx-loader.js
NoReviews.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const UrlUtils = require('utils/Url');
const PRODUCT_ADD_REVIEWS_URL = '/addReview?productId=';

NoReviews.prototype.clickHandler = function (e, productId) {
    e.preventDefault();
    UrlUtils.redirectTo(PRODUCT_ADD_REVIEWS_URL + productId);

};


// Added by sephora-jsx-loader.js
module.exports = NoReviews.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/NoReviews/NoReviews.c.js