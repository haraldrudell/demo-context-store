// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RatingsSummary = function () {};

// Added by sephora-jsx-loader.js
RatingsSummary.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const UrlUtils = require('utils/Url');
const PRODUCT_RATINGS_AND_REVIEWS_URL = '/reviews?productId=';
const PRODUCT_ADD_REVIEWS_URL = '/addReview?productId=';

RatingsSummary.prototype.clickHandler = function (e, currentProduct) {
    e.preventDefault();
    if (Sephora.isMobile()) {
        if (this.hasReviews(currentProduct)) {
            this.redirectToProductReviewsPage(currentProduct);
        } else {
            this.redirectToAddReviewPage(currentProduct);
        }
    } else {
        document.getElementById('ratings-reviews').scrollIntoView();
    }
};

RatingsSummary.prototype.hasReviews = function (currentProduct) {
    return currentProduct.reviews !== undefined;
};

RatingsSummary.prototype.redirectToAddReviewPage = function (currentProduct) {
    UrlUtils.redirectTo(PRODUCT_ADD_REVIEWS_URL + currentProduct.productId);
};

RatingsSummary.prototype.redirectToProductReviewsPage = function (currentProduct) {
    UrlUtils.redirectTo(PRODUCT_RATINGS_AND_REVIEWS_URL + currentProduct.productId);
};


// Added by sephora-jsx-loader.js
module.exports = RatingsSummary.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/RatingsSummary/RatingsSummary.c.js