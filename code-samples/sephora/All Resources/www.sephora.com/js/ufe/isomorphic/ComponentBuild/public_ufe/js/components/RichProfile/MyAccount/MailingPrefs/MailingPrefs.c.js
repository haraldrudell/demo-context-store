// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MailingPrefs = function () {};

// Added by sephora-jsx-loader.js
MailingPrefs.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const UserUtils = require('utils/User');
const { ensureUserIsSignedIn } = require('utils/decorators');

MailingPrefs.prototype.ctrlr = function (user) {
    this.setState({
        shouldShowPostalMailPrefs: UserUtils.isBI()
    });
};

MailingPrefs.prototype.handleSectionExpand = function (sectionComponent) {
    let sections = [
        this._promotionalEmailPrefs,
        this._notificationsAndRemindersPrefs
    ];

    if (UserUtils.isBI()) {
        sections.push(this._postalMailPrefs);
    }

    for (let i = 0, l = sections.length; i < l; i++) {
        if (sections[i] !== sectionComponent) {
            sections[i].switchToViewMode();
        }
    }
};

MailingPrefs = ensureUserIsSignedIn(MailingPrefs);


// Added by sephora-jsx-loader.js
module.exports = MailingPrefs.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/MailingPrefs/MailingPrefs.c.js