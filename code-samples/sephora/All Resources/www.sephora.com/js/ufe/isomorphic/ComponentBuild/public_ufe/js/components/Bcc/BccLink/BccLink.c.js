// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccLink = function () {};

// Added by sephora-jsx-loader.js
BccLink.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showBccModal = require('Actions').showBccModal;
const analyticsUtils = require('analytics/utils');

BccLink.prototype.ctrlr = function () { };

BccLink.prototype.toggleOpen = function (e) {
    const TARGET_TYPES = { SAME: 0, NEW: 1, OVERLAY: 2 };

    if (this.props.target === TARGET_TYPES.OVERLAY && this.props.modalTemplate && e) {
        store.dispatch(showBccModal(true, this.props.modalTemplate, this.props.componentName));
        e.preventDefault();
    }
};

//Analytics
BccLink.prototype.trackNavClick = function (path) {
    analyticsUtils.setNextPageData({
        navigationInfo: analyticsUtils.buildNavPath(path)
    });
};


// Added by sephora-jsx-loader.js
module.exports = BccLink.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccLink/BccLink.c.js