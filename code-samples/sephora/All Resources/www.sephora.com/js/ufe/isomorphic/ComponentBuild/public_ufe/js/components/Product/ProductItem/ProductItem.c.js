// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductItem = function () {};

// Added by sephora-jsx-loader.js
ProductItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');
const sephLocalStorage = require('utils/localStorage/LegacyMW');

ProductItem.prototype.ctrlr = function () {};

ProductItem.prototype.toggleHover = function () {
    if (!Sephora.isTouch) {
        this.setState({ hover: !this.state.hover });
    }
};

ProductItem.prototype.onClick = function () {
    // TODO: refactor once PDP is converted to UFE
    var ddExtRecs = digitalData.page.attributes.externalRecommendations;

    anaUtils.setNextPageData({
        recInfo: {
            isExternalRec: ddExtRecs.vendor,
            certonaAudienceId: ddExtRecs.audienceId,
            certonaExperienceId: ddExtRecs.experienceId,
            componentTitle: this.props.rootContainerName
        }
    });

    /* ToDo: This should be removed as it is now redundant. We now use the cookie solution above
    ** for Desktop and Mweb because of https to http data loss. I just don't want to remove it
    ** now because it seems too risky */
    if (Sephora.isMobile()) {
        //MWeb - Legacy Pdp
        sephLocalStorage.setLegacyJStorageItem.call(sephLocalStorage, 'carouselData', {
            recType: 'certona',
            previousPageType: digitalData.page.category.pageType,
            name: this.props.rootContainerName,
            audienceId: ddExtRecs.audienceId,
            experienceId: ddExtRecs.experienceId
        });
    }
};


// Added by sephora-jsx-loader.js
module.exports = ProductItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductItem/ProductItem.c.js