// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AddReviewCarousel = function () {};

// Added by sephora-jsx-loader.js
AddReviewCarousel.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const authentication = require('utils/Authentication');
const Location = require('utils/Location');
const store = require('Store');
const watch = require('redux-watch');
const ProductActions = require('actions/ProductActions');
const ProductWatcher = require('components/ProductPage/Type/ProductWatcher');
const communityUtils = require('utils/Community');
const UrlUtils = require('utils/Url');
const skuUtils = require('utils/Sku');
const UI = require('utils/UI');
const userUtil = require('utils/User');
const bvService = require('services/api/thirdparty/BazaarVoice');
const userUtils = require('utils/User');
const biUtils = require('utils/BiProfile');
const utilityApi = require('services/api/utility');
const lithiumApi = require('services/api/thirdparty/Lithium');
const Filters = require('utils/Filters');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const productPageBindings =
    require('analytics/bindingMethods/pages/productPage/productPageBindings');

// Set to true only if the user cancelled out of social login prior to the product response
// returning.
let isRedirectNeeded = false;

let redirectToProductPage = function (productPageUrl) {
    Location.setLocation(productPageUrl);
};

const ABOUT_ME_QUESTIONS = [biUtils.TYPES.SKIN_TYPE, biUtils.TYPES.SKIN_CONCERNS,
    biUtils.TYPES.SKIN_TONE, biUtils.TYPES.HAIR_COLOR, biUtils.TYPES.HAIR_DESCRIBE,
    biUtils.TYPES.HAIR_CONCERNS, biUtils.TYPES.EYE_COLOR];

AddReviewCarousel.prototype.ctrlr = function () {
    let productId = null;
    let skuId = null;

    // path should be /{productId}/review
    let loc = Location.getLocation();
    if (loc.pathname) {
        let match = loc.href.match(/productId=(P\d+)/i);
        if (match) {
            productId = match[1];
        }

        skuId = UrlUtils.getParamsByName('skuId');
    } else {
        // if we cannot parse out the product ID (should never happen given the spring rules)
    }
    let getProduct = new Promise((resolve, reject) => {
        let watchCurrentProduct = watch(store.getState, 'product.currentProduct');
        let unsubscribeCurrentProduct = store.subscribe(watchCurrentProduct((currentProduct) => {
            unsubscribeCurrentProduct();
            if (isRedirectNeeded) {
                redirectToProductPage(currentProduct.targetUrl);
            } else {
                if (skuId || currentProduct.variationType !== skuUtils.skuVariationType.COLOR) {
                    this.setState({ skipShades: true }, resolve);
                } else {
                    resolve();
                }
                this.setState({ currentProduct: currentProduct }, () => {
                    ProductWatcher.watchProductAndUser(this);
                });
            }
        }));
    });

    store.dispatch(ProductActions.fetchCurrentProduct(productId, skuId));

    let getReviewData = new Promise((resolve, reject) => {
        authentication.requireLoggedInAuthentication().
        then(() => communityUtils.
        ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.bv)).
        then(() => {
            // Lazy Load of needed information regarding About Me
            utilityApi.getAboutMeReviewQuestions(productId).then(data => {
                this.setState({
                    isUserReviewAllowed: true
                });
                if (data.aboutMeQuestions && data.aboutMeQuestions.length) {
                    let aboutMeBiTraits = [];
                    let user = store.getState().user;
                    let biAccount = user.beautyInsiderAccount;
                    let info = userUtil.biPersonalInfoDisplayCleanUp(biAccount.
                        personalizedInformation);
                    data.aboutMeQuestions.forEach(question => {
                        if (!info[question] && ABOUT_ME_QUESTIONS.indexOf(question) >= 0) {
                            aboutMeBiTraits.push(question);
                        }
                    });

                    if (aboutMeBiTraits.length) {
                        this.setState({
                            aboutMeBiTraits: aboutMeBiTraits,
                            biAccount: biAccount
                        }, resolve);
                    } else {
                        resolve();
                    }
                }
            }).catch(() => {
                this.setState({
                    isUserReviewAllowed: true
                }, resolve);
            });
        }).catch(reason => {
            // If the user cancels at any state of signin then redirect to product page.
            // If the product response has already returned, we can redirect immediately.
            // Otherwise, we have to wait for the product response to get the seo friend url
            if (this.state.currentProduct) {
                redirectToProductPage(this.state.currentProduct.seoCanonicalUrl);
            } else {
                isRedirectNeeded = true;
            }
        });
    });
    Promise.all([getProduct, getReviewData]).then(() => this.sendAnalytics());
};

AddReviewCarousel.prototype.submitReview = function (submitData) {
    let { currentProduct } = this.state;
    let productId;

    // if the product does not have skus that are color swatch based, then submit productId
    // else submit the skuId
    // this is because as of sprint 2017.6, the only skuIds submitted as a 'productId'
    // to BV's feed from Sephora are those that have color swatches
    if (currentProduct.variationType !== skuUtils.skuVariationType.COLOR) {
        productId = currentProduct.productId;
    } else {
        productId = currentProduct.currentSku.skuId;
    }

    bvService.submitReview({
        productId: productId,
        title: submitData.reviewTitle,
        rating: submitData.rating,
        isRecommended: submitData.isRecommended,
        reviewText: submitData.reviewText,
        photos: submitData.photos,
        isFreeSample: submitData.isFreeSample,
        isSephoraEmployee: submitData.isSephoraEmployee,
        userId: userUtils.getProfileId()
    }).then(() => {
        // Call the Gamification Engagement API
        const INTERACTION_TYPE = 'review_posted';
        const INCREMENT_AMOUNT = 1;
        lithiumApi.incrementUserScore(INTERACTION_TYPE, INCREMENT_AMOUNT);

        this.onNext();
    }).catch(errors => {
        let submissionErrors = [];
        if (errors instanceof Array) {
            submissionErrors = errors.map(error => error.Message);
        } else if (typeof errors === 'object' && errors.message) {
            submissionErrors.push(errors.message);
        }
        this.setState({ submissionErrors: submissionErrors }, () => this.onNext());
    });
};

AddReviewCarousel.prototype.onNext = function (rateAndReviewData) {
    this.sendAnalytics(this.carousel.getCurrentPage());
    if (rateAndReviewData) {
        this.setState({
            submitData: Object.assign({}, this.state.submitData, rateAndReviewData || {})
        }, () => {
            let showAboutMe = this.state.aboutMeBiTraits && this.state.biAccount;
            if (showAboutMe) {
                UI.scrollToTop();
                this.carousel.nextPage();
            } else {
                this.submitReview(this.state.submitData);
            }
        });
    } else {
        UI.scrollToTop();
        this.carousel.nextPage();
    }
};

AddReviewCarousel.prototype.sendAnalytics = function (currentNumber = 0) {
    let currentPage = this.addReviewPages[currentNumber];
    let pageType = 'reviews';
    let pageDetail;
    let world = productPageBindings.getProductWorld(this.state.currentProduct) || 'n/a';
    switch (currentPage) {
        case Filters.ADD_REVIEW_PAGES_NAMES.SHADES:
            pageDetail = 'ratings&reviews-select sku';
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: [pageType, pageDetail, world + ':*'].join(':'),
                    pageType,
                    pageDetail
                }
            });
            break;
        case Filters.ADD_REVIEW_PAGES_NAMES.RATE_AND_REVIEW:
            pageDetail = 'ratings&reviews-write';
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: [pageType, pageDetail, world + ':*'].join(':'),
                    pageType,
                    pageDetail,
                    eventStrings: [anaConsts.Event.ADD_REVIEW_RATE_AND_REVEW],
                    productStrings: anaUtils.buildSingleProductString(this.state.
                        currentProduct.currentSku)
                }
            });
            break;
        case Filters.ADD_REVIEW_PAGES_NAMES.ABOUT_YOU:
            pageDetail = 'ratings&reviews-about you';
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: [pageType, pageDetail, world + ':*'].join(':'),
                    pageType,
                    pageDetail
                }
            });
            break;
        case Filters.ADD_REVIEW_PAGES_NAMES.CONFIRMATION:
            pageDetail = 'ratings&reviews-submit';
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: [pageType, pageDetail, world + ':*'].join(':'),
                    pageType,
                    pageDetail,
                    eventStrings: [anaConsts.Event.ADD_REVIEW_CONFIRMATION],
                    productStrings: anaUtils.buildSingleProductString(this.state.
                        currentProduct.currentSku)
                }
            });
            break;
        default:
    }
};


// Added by sephora-jsx-loader.js
module.exports = AddReviewCarousel.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/AddReviewCarousel/AddReviewCarousel.c.js