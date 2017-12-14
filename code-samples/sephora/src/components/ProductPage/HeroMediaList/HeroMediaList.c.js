// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var HeroMediaList = function () {};

// Added by sephora-jsx-loader.js
HeroMediaList.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const reduxActionWatch = require('redux-action-watch');
const CarouselActions = require('actions/CarouselActions');
const VirtualArtistActions = require('actions/VirtualArtistActions');
const Modiface = require('services/api/thirdparty/Modiface');
const store = require('Store');
const VIRTUAL_ARTIST_INDEX = 1;
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');
const productPageLinkTracking = require('analytics/bindings/pages/product/productPageLinkTracking');

HeroMediaList.prototype.ctrlr = function () {
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        CarouselActions.TYPES.HOVERED_CAROUSEL_ITEM,
        this.toggleHover);
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        CarouselActions.TYPES.CLICKED_CAROUSEL_ITEM,
        this.handleCarouselClick);
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        CarouselActions.TYPES.MOVED_OVER_CAROUSEL_ITEM,
        this.toggleMoveOver);
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        VirtualArtistActions.TYPES.SHOW_VIRTUAL_ARTIST,
        this.moveToVirtualArtist);
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        VirtualArtistActions.TYPES.SWIPE_VIRTUAL_ARTIST,
        this.swipeVirtualArtist);
};

HeroMediaList.prototype.toggleHover = function (action) {
    switch (action.carouselName) {
        case this.state.heroThumbnailCarouselName:
            if (action.isHovered) {
                this.heroListCarousel.moveTo(action.itemIndex + 1);
            } else {
                this.heroListCarousel.moveTo(this.heroThumbnailCarousel.getCurrentActiveItem() + 1);
            }
            break;
        case this.state.heroListCarouselName:
            if (!action.isHovered) {
                this.setState({
                    isZoomLoopOpen: false
                });
            }
            break;
        default:
    }
};

HeroMediaList.prototype.enableZoom = function (enable) {
    this.setState({
        zoomable: enable &&
            this.heroThumbnailCarousel.getCurrentActiveItem() !== VIRTUAL_ARTIST_INDEX
    });
};

HeroMediaList.prototype.toggleMoveOver = function (action) {
    switch (action.carouselName) {
        case this.state.heroListCarouselName: {
            let zoomedItem = this.mediaListItems[action.itemIndex];
            if (zoomedItem.type === 'IMAGE') {
                this.setState({
                    isZoomLoopOpen: this.state.zoomable,
                    zoomLoopImage: zoomedItem.media,
                    zoomLoopCoords: action.coords
                });
            }
            break;
        }
        default:
    }
};

HeroMediaList.prototype.handleCarouselClick = function (action) {
    let currentItem = this.mediaListItems[action.itemIndex];

    switch (action.carouselName) {
        case this.state.heroThumbnailCarouselName:
            this.setState({
                zoomable: currentItem.type === 'IMAGE'
            });
            if (Sephora.isDesktop() && Sephora.isTouch) { // Mimic Tablet IPad experience
                this.toggleHover({
                    itemIndex: action.itemIndex,
                    isHovered: true,
                    carouselName: action.carouselName
                });
            }
            break;
        case this.state.heroListCarouselName:
            if (this.isZoomModal(currentItem)) {
                this.setState({
                    isZoomModalOpen: true,
                    zoomModalImage: currentItem.media
                });
            }
            break;
        default:
    }
};

HeroMediaList.prototype.moveToVirtualArtist = function (action) {
    if (action.isVisible && this.props.virtualArtist) {
        this.heroListCarousel.moveTo(VIRTUAL_ARTIST_INDEX + 1);
        if (!Sephora.isMobile()) {
            this.heroThumbnailCarousel.updateCurrentActiveItem(null, VIRTUAL_ARTIST_INDEX);
        }
        this.setState({
            zoomable: false
        });
    }
};

HeroMediaList.prototype.swipeVirtualArtist = function (action) {
    // Real SVA index is VIRTUAL_ARTIST_INDEX + 1. It means that:
    if (action.direction === 'left') {
        this.heroListCarousel.moveTo(VIRTUAL_ARTIST_INDEX + 2);
    } else if (action.direction === 'right') {
        this.heroListCarousel.moveTo(VIRTUAL_ARTIST_INDEX);
    }
};

HeroMediaList.prototype.isZoomModal = function (currentItem) {
    return Sephora.isTouch && currentItem.type === 'IMAGE';
};

HeroMediaList.prototype.sendAnalytics = function (type, item) {
    switch (type) {
        case this.MEDIA_TYPE.VIDEO: {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: [productPageLinkTracking.heroVideoClickBindings],
                    videoItem: item
                }
            });
            break;
        }
        default:
    }
};


// Added by sephora-jsx-loader.js
module.exports = HeroMediaList.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/HeroMediaList/HeroMediaList.c.js