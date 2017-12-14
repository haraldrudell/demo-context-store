// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SocialSlide = function () {};

// Added by sephora-jsx-loader.js
SocialSlide.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const showShareLinkModal = require('Actions').showShareLinkModal;
const store = require('Store');

SocialSlide.prototype.launchSocialShareModal = function () {
    let shareUrl = `${window.location.origin}/users/${this.props.nickname}`;
    store.dispatch(
        showShareLinkModal(true, `${this.props.nickname}'s Profile`, shareUrl)
    );
};


// Added by sephora-jsx-loader.js
module.exports = SocialSlide.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/AboutMeSlideshow/SocialSlide/SocialSlide.c.js