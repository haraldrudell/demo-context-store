// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductRecommendations = function () {};

// Added by sephora-jsx-loader.js
ProductRecommendations.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Events = require('utils/framework/Events');
const InflatorComps = require('utils/framework/InflateComponents');
const store = require('Store');

const recommendedText = 'Recommended for You';

ProductRecommendations.prototype.ctrlr = function () {
    Events.onLastLoadEvent(window, [Events.CertonaReady], () => {
        // We are only using the “Recommended for you” array. Certona randomly gets reset,
        // so we have to find the CURRENT index where recommended products are. Also, indexes
        // might be different for desktop, mobile, local, production and qa.
        let carouselIndex;
        let skuGroups = store.getState().productRecs.skuGroups;
        for (let i = 0; i < skuGroups.length; i++) {
            if (skuGroups[i].recommendTitle === recommendedText) {
                carouselIndex = i;
                break;
            }
        }

        // We are only using the “Recommended for you” array. Certona randomly gets reset,
        // so we have to find the CURRENT index where recommended products are. Also, indexes
        // might be different for desktop, mobile, local, production and qa.
        // Adding 1 to the result because we're reusing Certona carousel response for
        // homepage, and there the index is obtained by counting all objects returned by Certona
        // and substracting 1. We get the zero-based index so we add 1 to account for that

        this.setState({
            certonaReady: true,
            carouselChildren: skuGroups[carouselIndex],
            carouselIndex: carouselIndex + 1
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = ProductRecommendations.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/ProductRecommendations/ProductRecommendations.c.js