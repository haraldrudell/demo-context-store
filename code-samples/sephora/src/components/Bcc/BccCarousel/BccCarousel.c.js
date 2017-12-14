// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccCarousel = function () {};

// Added by sephora-jsx-loader.js
BccCarousel.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const preprocessCertonaImpression = require('analytics/preprocess/preprocessCertonaImpression');

BccCarousel.prototype.ctrlr = function () {
    let skuList = [];
    if (Sephora.Certona.isEnabled === 'true' && !this.props.nested) {

        // TODO: Certona analytics
    
        // If 'productRecs.skuGroups' is updated BEFORE BccCarousel gets the chance
        // to subscribe, it would not show the product recommendations that are
        // already on the store. Avoid that by checking if there are productRecs
        let productRecs = store.getState().productRecs;
        if (productRecs && productRecs.skuGroups && productRecs.skuGroups.length > 0) {
            this.setCarouselItems(this.displayCertonaRecs(productRecs.skuGroups));
        } else {
            let w = watch(store.getState, 'productRecs.skuGroups');
            store.subscribe(w((newVal, oldVal, objectPath) => {
                skuList = this.displayCertonaRecs(newVal);
                this.setCarouselItems(skuList);
            }));
        }

    } else {
        this.setCarouselItems(this.props.carouselItems);
    }
};

BccCarousel.prototype.displayCertonaRecs = function (recs) {
    let index = this.props.carouselIndex - 1;
    let skuList = [];

    // Only swap bcc for certona if not a rewards carousel or nested carousel
    if (index < recs.length && recs[index].isDisplay && this.props.componentType !== 62) {

        // Display certona recs
        // TODO 17.7: Move all Certona data to state
        skuList = recs[index].data;
        this.props.totalItems = recs[index].data.length;
        this.props.title = recs[index].recommendTitle;
        this.props.isCertonaCarousel = true;
        this.props.headerImage = null;
        this.props.subHead = null;
        this.props.moreTarget = null;

        // Analytics
        preprocessCertonaImpression.setShownStatus(true);
    } else {

        // Display bcc products
        skuList = this.props.carouselItems;
    }

    return skuList;
};

BccCarousel.prototype.processCircle = function (skuList) {

    // If a circle carousel does not have enough items to fill the last slide/page,
    // add blank items to fill in the gap on the last slide
    const isMobile = Sephora.isMobile();
    let count = this.props.totalItems;
    while ((count / (isMobile ? 2 : this.props.displayCount)) % 1 !== 0) {
        skuList.push({
            isBlank: true
        });
        count++;
    }

    return skuList.concat(skuList.slice(0, (isMobile ? 2 : this.props.displayCount)));
};

BccCarousel.prototype.setCarouselItems = function (skus) {
    if (this.props.isEnableCircle) {
        skus = this.processCircle(skus);
    }

    let newState = {
        carouselItems: skus
    };
    
    if (skus) {
        newState.totalItems = skus.length;
    }

    this.setState(newState);
};


// Added by sephora-jsx-loader.js
module.exports = BccCarousel.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccCarousel/BccCarousel.c.js