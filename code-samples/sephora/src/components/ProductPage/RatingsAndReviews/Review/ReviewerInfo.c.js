// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ReviewerInfo = function () {};

// Added by sephora-jsx-loader.js
ReviewerInfo.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const userUtils = require('utils/User');
const UrlUtils = require('utils/Url');
const store = require('Store');
const biUtils = require('utils/BiProfile');
const RICH_PROFILE_URL = '/users/';

ReviewerInfo.prototype.ctrlr = function () {};

ReviewerInfo.prototype.showBeautyMatchesIcon = function () {
    const traitList = [
        biUtils.TYPES.EYE_COLOR,
        biUtils.TYPES.HAIR_COLOR,
        biUtils.TYPES.SKIN_TONE,
        biUtils.TYPES.SKIN_TYPE
    ];

    if (this.props.biTraits && Object.keys(this.props.biTraits).length > 0 && this.props.user) {
        let matchingTraits = 
            biUtils.getMatchingBiTraits(this.props.user.biUserInfo, this.props.biTraits, traitList);
        
        if (matchingTraits && matchingTraits.length === traitList.length) {
            return true;
        }
    }

    return false;
};

ReviewerInfo.prototype.redirectToUserProfile = function (nickName) {
    UrlUtils.redirectTo(RICH_PROFILE_URL + nickName);
};


// Added by sephora-jsx-loader.js
module.exports = ReviewerInfo.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/Review/ReviewerInfo.c.js