// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Markdown = function () {};

// Added by sephora-jsx-loader.js
Markdown.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showBccModal = require('Actions').showBccModal;
const analyticsUtils = require('analytics/utils');

Markdown.prototype.ctrlr = function () { };

Markdown.prototype.handleClick = function (e) {
    if (this.props.modalComponentTemplate) {
        e.preventDefault();
        store.dispatch(showBccModal(true, this.props.modalComponentTemplate,
            this.props.componentName));

    }

    //Analytics
    if (this.props.anaNavPath) {
        analyticsUtils.setNextPageData(
            { navigationInfo: analyticsUtils.buildNavPath(this.props.anaNavPath) }
        );
    }
};


// Added by sephora-jsx-loader.js
module.exports = Markdown.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Markdown/Markdown.c.js