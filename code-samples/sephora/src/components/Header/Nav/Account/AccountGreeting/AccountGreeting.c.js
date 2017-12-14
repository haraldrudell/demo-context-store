// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountGreeting = function () {};

// Added by sephora-jsx-loader.js
AccountGreeting.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const processEvent = require('analytics/processEvent');
const store = require('Store');
const auth = require('utils/Authentication');
const enableApplePaySession = require('Actions').enableApplePaySession;

AccountGreeting.prototype.signInHandler = function (e) {
    e.stopPropagation();

    let analyticsData = {
        navigationInfo: anaUtils.buildNavPath(['top nav', 'account', 'sign-in'])
    };

    // Disable applePay session, if it was active
    // Otherwise there could be issues with showing Default SignIn modal for mobile devices
    store.dispatch(enableApplePaySession(false));

    auth.requireAuthentication(null, null, analyticsData);
};

AccountGreeting.prototype.registerHandler = function (e) {
    e.stopPropagation();
    const showRegisterModal = require('Actions').showRegisterModal;
    store.dispatch(showRegisterModal(true));

    if (!Sephora.isLegacyMode) { // TODO: Remove after legacy removed
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                navigationInfo: anaUtils.buildNavPath(['top nav', 'account', 'register']),
                pageName: 'register:register:n/a:*',
                pageType: 'register',
                pageDetail: 'register',
                eventStrings: [anaConsts.Event.REGISTRATION_STEP_1]
            }
        });
    }
};


// Added by sephora-jsx-loader.js
module.exports = AccountGreeting.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Account/AccountGreeting/AccountGreeting.c.js