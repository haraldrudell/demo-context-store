// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ExploreThisProduct = function () {};

// Added by sephora-jsx-loader.js
ExploreThisProduct.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const olapicApi = require('services/api/thirdparty/Olapic');
const olapicUtils = require('utils/Olapic');
const urlUtils = require('utils/Url');
const store = require('store/Store');
const reduxActionWatch = require('redux-action-watch');
const ProductActions = require('actions/ProductActions');
const utilityApi = require('services/api/utility');
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');

const BEAUTY_BOARD_MEDIA_PER_PAGE = 10;
const MAX_LOOKS_COUNT = 50;
const MAX_VIDEOS_COUNT = 18;

const BI_TYPES_WITHOUT_LOOKS = [
    'birthday gift',
    'rouge birthday gift',
    'welcome kit'
];

ExploreThisProduct.prototype.pullNextBeautyBoardMediaPage = function (searchParams, filtered) {

    let {
        media,
        showMediaItems,
        mediaPage
    } = this.state;

    // reset media if it was filtered
    if (filtered) {
        media = [];
        showMediaItems = 0;
        mediaPage = 0;
    }

    if (media.length < MAX_LOOKS_COUNT) {
        /**
         * If we already got enough images from Olapic to show the next slide -> just show it.
         * Otherwise - make a request.
         */
        if (showMediaItems + BEAUTY_BOARD_MEDIA_PER_PAGE > media.length) {
            searchParams = searchParams || this.state.searchParams;

            // could be filtered by skuIds OR productId
            if (searchParams.skuId && searchParams.skuId.length) {
                delete searchParams.productId;
            } else {
                delete searchParams.skuId;
                searchParams.productId = this.props.productId;
            }

            let getProductMedia = olapicApi.getProductMedia(searchParams, mediaPage + 1,
                BEAUTY_BOARD_MEDIA_PER_PAGE);

            // This promise based on cached result of getProductMedia request
            // This way we prevent second API call to Olapic
            let getProductMediaNum = getProductMedia.then(() =>
                olapicApi.getProductMediaNum(searchParams));

            Promise.all([getProductMedia, getProductMediaNum]).then(values => {
                let [fetchedMedia, mediaNum] = values;
                let newMedia = media.concat(fetchedMedia).slice(0, MAX_LOOKS_COUNT - 1);
                if (newMedia.length === MAX_LOOKS_COUNT - 1) {
                    newMedia = newMedia.concat({ lastItem: true });
                }
                this.setState({
                    media: newMedia,
                    showMediaItems:
                        Math.min(showMediaItems + BEAUTY_BOARD_MEDIA_PER_PAGE, mediaNum),
                    mediaPage: mediaPage + 1,
                    total: mediaNum,
                    searchParams: searchParams,
                    previousSearchParams: filtered ?
                        this.state.searchParams : this.state.previousSearchParams,
                    filtered: filtered
                });
            });
        } else {
            this.setState({
                showMediaItems: this.state.showMediaItems + BEAUTY_BOARD_MEDIA_PER_PAGE
            });
        }
    }
};

ExploreThisProduct.prototype.isGift = function (sku) {
    if (sku.biType) {
        return Object.values(BI_TYPES_WITHOUT_LOOKS).indexOf(sku.biType) === -1;
    } else {
        return false;
    }
};

ExploreThisProduct.prototype.fetchVideos = function (productId) {
    utilityApi.getOoyalaVideosRelatedToProduct(productId).
        then(videos => {
            this.setState({ videos: videos.slice(0, MAX_VIDEOS_COUNT) });
        });
};

ExploreThisProduct.prototype.openBeautyBoardMedium = function (medium, index) {
    if (index === MAX_LOOKS_COUNT) {
        // Per AC 7.3 of ILLUPH-87184, need to redirect to Gallery Product filter
        // on last element click
        urlUtils.redirectTo('/gallery?productFilter=product-' + this.props.productId);
    } else {
        olapicUtils.openLightbox(medium.id);
    }

    // Analytics
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: 'product_learn more_related photos',
            photoId: medium.id,
            eventStrings: anaConsts.Event.EVENT_71,
            actionInfo: 'product_learn more_related photos',
            internalCampaign: 'product_learn more_related photos'
        }
    });
};

ExploreThisProduct.prototype.applyBeautyMatchFilters = function (filters) {
    let beautyMatchFilters;

    if (Object.keys(filters).length === 0) {
        beautyMatchFilters = this.state.previousSearchParams;
    } else {

        // we need to lowercase BI traits
        let lowercasedFilters = {};
        Object.keys(filters).forEach(key =>
            lowercasedFilters[key] = filters[key].map(elem => elem.toLowerCase()));

        beautyMatchFilters = Object.assign({}, this.state.searchParams, lowercasedFilters);
    }
    this.pullNextBeautyBoardMediaPage(beautyMatchFilters, true);
};

ExploreThisProduct.prototype.ctrlr = function () {
    olapicUtils.enableLightbox();
    this.pullNextBeautyBoardMediaPage({ productId: this.props.productId }, false);
    this.fetchVideos(this.props.productId);

    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.GALLERY_FILTERS_APPLIED,
        (data) => {
            this.pullNextBeautyBoardMediaPage(Object.assign({},
                                                            this.state.searchParams,
                                                            { skuId: data.filters }), true);
        });

    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.RESET_GALLERY_FILTERS,
        () => {
            this.pullNextBeautyBoardMediaPage({ productId: this.props.productId }, true);
        });
};


// Added by sephora-jsx-loader.js
module.exports = ExploreThisProduct.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ExploreThisProduct/ExploreThisProduct.c.js