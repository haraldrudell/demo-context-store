// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RecentReviews = function () {};

// Added by sephora-jsx-loader.js
RecentReviews.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const snbApi = require('services/api/search-n-browse');
const REVIEW_DISPLAY_LIMIT = 2;

RecentReviews.prototype.ctrlr = function () {
    let reviewsDataPromises = this.props.reviews.slice(0, REVIEW_DISPLAY_LIMIT).
            map(review =>
                    snbApi.getProductDetails(
                            review.productId,
                            review.skuId,
                            { addCurrentSkuToProductChildSkus: true }).
                        then(product => ({
                            review, product 
                        })));

    // (!) Failure of any request would result in failure to render page.
    // TODO Address this concern.

    Promise.all(reviewsDataPromises).then(reviewsData => {
        this.setState({ reviewsData });
    });
};


// Added by sephora-jsx-loader.js
module.exports = RecentReviews.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/RecentReviews/RecentReviews.c.js