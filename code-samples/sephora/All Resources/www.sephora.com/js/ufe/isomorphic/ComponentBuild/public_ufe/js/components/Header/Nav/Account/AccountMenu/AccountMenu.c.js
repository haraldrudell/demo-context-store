// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountMenu = function () {};

// Added by sephora-jsx-loader.js
AccountMenu.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const anaUtils = require('analytics/utils');
const store = require('Store');
const signOut = require('actions/UserActions').signOut;
const userUtils = require('utils/User');

AccountMenu.prototype.ctrlr = function () {
    store.setAndWatch('user', null, (data) => {
        this.setState({
            isAnonymous: userUtils.isAnonymous()
        });
    });
};

AccountMenu.prototype.trackNavClick = function (link) {
    const path = ['top nav', 'account', link];
    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(path)
    });
};

AccountMenu.prototype.signOutClickHandler = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!Sephora.isThirdPartySite) {
        let redirectTo = window.location.href;
        
        // This should be read as: users that sign out while on Rich Profile pages,
        // should always get landed onto the homepage.
        if (Sephora.pagePath &&
                (Sephora.pagePath.split('/')[1] === 'RichProfile')) {
            redirectTo = '/';
        }

        store.dispatch(signOut(redirectTo));
        this.trackNavClick('sign out');
    }
};


// Added by sephora-jsx-loader.js
module.exports = AccountMenu.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/Account/AccountMenu/AccountMenu.c.js