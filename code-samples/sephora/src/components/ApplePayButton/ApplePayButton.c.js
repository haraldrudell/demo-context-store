// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ApplePayButton = function () {};

// Added by sephora-jsx-loader.js
ApplePayButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const ApplePay = require('services/ApplePay');

//Analytics
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');

ApplePayButton.prototype.ctrlr = function () { };

ApplePayButton.prototype.onClick = function (e) {
    e.stopPropagation();
    e.preventDefault();

    //Analytics
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: 'checkout:payment:applepay',
            actionInfo: 'checkout:payment:applepay',
            eventStrings: [anaConsts.Event.EVENT_71]
        }
    });

    ApplePay.onApplePayClicked(e);
};


// Added by sephora-jsx-loader.js
module.exports = ApplePayButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ApplePayButton/ApplePayButton.c.js