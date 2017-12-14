// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RatingsAndReviews = function () {};

// Added by sephora-jsx-loader.js
RatingsAndReviews.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const UrlUtils = require('utils/Url');
const bazaarVoiceApi = require('services/api/thirdparty/BazaarVoice');
const reduxActionWatch = require('redux-action-watch');
const store = require('Store');
const searchActions = require('actions/SearchActions');
const ProductActions = require('actions/ProductActions');
const Location = require('utils/Location');
const Filters = require('utils/Filters');
const userUtils = require('utils/User');
const biUtils = require('utils/BiProfile');

const PRODUCT_RATINGS_AND_REVIEWS_URL = '/reviews?productId=';
const PRODUCT_ADD_REVIEWS_URL = '/addReview?productId=';
const PAGE_SIZE = 30;
const DEFAULT_FILTER = { [Filters.REVIEW_FILTERS_TYPES.SORT]: [Filters.REVIEW_SORT_TYPES[0]] };

RatingsAndReviews.prototype.ctrlr = function () {
    this.loadInitialReviews(DEFAULT_FILTER);

    store.setAndWatch('user', null, () => {
        this.setState({
            user: {
                isBI: userUtils.isBI(),
                isAnonymous: userUtils.isAnonymous(),
                biUserInfo: biUtils.getBiProfileInfo()
            }
        });
    });

    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.REVIEW_FILTERS_APPLIED,
        (data) => {
            this.filterReviews(data.filters);
        });

    // Hide the search drawer on load of standalone Reviews page by default.
    if (Location.isProductReviewsPage()) {
        store.dispatch(searchActions.hideSearch());
    }
};

RatingsAndReviews.prototype.nextStep = function () {
    return this.state.step + this.REVIEWS_TO_SHOW;
};

/** we fetch reviews on these cases:
 * 1. on init or when the controller it's called.
 * 2. when the step is near the page limit.
 * 3. when a new filter/sorting is applied.
 * 4. on reseting filters/sorting
 */
RatingsAndReviews.prototype.fetchData = function (filters, isFirstCall) {
    let page;
    let offset;
    let nextStep;
    const { productId } = this.props;
    let filtersToApply = Object.assign({}, filters || this.state.filtersApplied);

    //compare given filter and state filter
    let hasNewFilter = JSON.stringify(filtersToApply) !== JSON.stringify(this.state.filtersApplied);

    //if we have a new filter we reset page, offset and nextStep
    if (hasNewFilter) {
        page = 1;
        offset = 0;
        nextStep = this.REVIEWS_TO_SHOW;
    } else {
        page = this.state.currentPage + 1;
        offset = (page - 1) * PAGE_SIZE;
        nextStep = this.state.step;
    }

    bazaarVoiceApi.getReviewsAndStats(productId, PAGE_SIZE, filtersToApply, offset)
        .then(data => {
            if (data.apiFailed) {
                this.setState({ showComponent: false });
                return;
            }

            if (!data.results) {
                return;
            }

            this.setState({
                showComponent: true,
                currentPage: page,
                hasNewFilter: isFirstCall ? false : hasNewFilter,
                step: nextStep,
                hasReviews: Array.isArray(data.results) && data.results.length > 0,
                reviews: hasNewFilter ? data.results : this.state.reviews.concat(data.results),
                totalReviews: data.totalResults,
                filtersApplied: filtersToApply,
                reviewStatistics: isFirstCall ? data.reviewStatistics : this.state.reviewStatistics
            });
        }).catch(error => error.apiFailed && this.setState({ showComponent: false }));
};

RatingsAndReviews.prototype.refresh = function () {
    this.fetchData(DEFAULT_FILTER);
};

RatingsAndReviews.prototype.filterReviews = function (filters) {
    this.fetchData(filters);
};

RatingsAndReviews.prototype.loadInitialReviews = function () {
    this.fetchData(DEFAULT_FILTER, true);
};

RatingsAndReviews.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    if (!nextState.reviews) {
        return true;
    }

    // A page is a chunk of data retrieved
    let {
        currentPage,
        step,
        hasNewFilter
    } = nextState;

    // it will render only if it's the first page or the step exceed the previous page.
    return !(currentPage > 1 && step <= (currentPage - 1) * PAGE_SIZE) || hasNewFilter;
};

RatingsAndReviews.prototype.loadMoreReviews = function () {
    /*eslint-disable no-new*/

    let nextStep = this.nextStep();
    this.setState({
        step: nextStep,
        hasNewFilter: false
    }, () => {
        if (nextStep === this.state.currentPage * PAGE_SIZE) {
            new Promise(() =>this.fetchMoreReviews());
            return;
        }
    });
};

RatingsAndReviews.prototype.fetchMoreReviews = function () {
    this.fetchData(this.state.filtersApplied);
};

RatingsAndReviews.prototype.clickSeeAllReviews = function (e, productId) {
    UrlUtils.redirectTo(PRODUCT_RATINGS_AND_REVIEWS_URL + productId);
};

RatingsAndReviews.prototype.redirectToAddReviewPage = function (productId) {
    UrlUtils.redirectTo(PRODUCT_ADD_REVIEWS_URL + productId);
};

RatingsAndReviews.prototype.onBeautyMatchCheckboxToggle = function (bbFilters, isChecked, name) {
    store.dispatch(ProductActions.beautyMatchFiltersToggled(bbFilters, isChecked, name));
};


// Added by sephora-jsx-loader.js
module.exports = RatingsAndReviews.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/RatingsAndReviews/RatingsAndReviews.c.js