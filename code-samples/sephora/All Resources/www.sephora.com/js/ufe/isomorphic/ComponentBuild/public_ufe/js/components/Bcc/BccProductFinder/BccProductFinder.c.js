// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BccProductFinder = function () {};

// Added by sephora-jsx-loader.js
BccProductFinder.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const showProductFinderModal = require('Actions').showProductFinderModal;
const store = require('Store');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

BccProductFinder.prototype.ctrlr = function () {
    store.setAndWatch([
        'productRecs.isQuizSubmitted',
        'productRecs.quizResults'
    ], this);

    /*Product Finder Page Load analytics */
    digitalData.page.category.pageType = anaConsts.PAGE_TYPES.PRODUCT_FINDER;
    digitalData.page.pageInfo.pageName = this.props.name;
    digitalData.page.attributes.additionalPageInfo = 'quiz';
};

BccProductFinder.prototype.openProductFinderModal = function () {
    store.dispatch(showProductFinderModal(true, this.props));

    /*Product Finder Quiz Start analytics */
    const anaProdFinderValue = `productfinder:start-quiz:${this.props.name}`;
    digitalData.page.attributes.sephoraPageInfo.pageName = anaProdFinderValue;
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: [require('analytics/bindings/pages/all/bccModalOpenEvent')],
            bccComponentName: anaProdFinderValue,
            actionInfo: anaProdFinderValue
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = BccProductFinder.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccProductFinder/BccProductFinder.c.js