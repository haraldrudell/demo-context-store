// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BackToTopButton = function () {};

// Added by sephora-jsx-loader.js
BackToTopButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const UI = require('utils/UI');
const Events = require('utils/framework/Events');

const BACK_TO_TOP_BUTTON_THRESHOLD = 942;

BackToTopButton.prototype.ctrlr = function () {
    window.addEventListener(Events.DebouncedScroll, this.handleScroll.bind(this));
};

BackToTopButton.prototype.onClick = function () {
    UI.scrollToTop();
    this.setState({ isShown: false });
};

/**
 * Update visibility of the back to top button on scroll
 */
BackToTopButton.prototype.handleScroll = function () {
    const value = window.pageYOffset > BACK_TO_TOP_BUTTON_THRESHOLD;

    if (value !== this.state.isShown) {
        this.setState({ isShown: value });
    }
};


// Added by sephora-jsx-loader.js
module.exports = BackToTopButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BackToTopButton/BackToTopButton.c.js