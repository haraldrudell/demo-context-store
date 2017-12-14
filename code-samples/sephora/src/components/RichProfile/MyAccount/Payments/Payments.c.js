// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Payments = function () {};

// Added by sephora-jsx-loader.js
Payments.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const { ensureUserIsSignedIn } = require('utils/decorators');
const profileApi = require('services/api/profile');

Payments.prototype.ctrlr = function (user) {
    this.userProfileId = user.profileId;

    profileApi.getCreditCardsFromProfile(this.userProfileId).then(payments => {
        this.setState({
            creditCards: payments.creditCards,
            paypal: payments.paypal,
            isPlaySubscribed: user.subscriptionPrograms &&
                user.subscriptionPrograms.play &&
                user.subscriptionPrograms.play.isActive
        });
    });
};

Payments = ensureUserIsSignedIn(Payments);


// Added by sephora-jsx-loader.js
module.exports = Payments.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Payments/Payments.c.js