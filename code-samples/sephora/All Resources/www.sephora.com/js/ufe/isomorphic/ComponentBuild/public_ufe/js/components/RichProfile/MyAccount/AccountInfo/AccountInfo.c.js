// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AccountInfo = function () {};

// Added by sephora-jsx-loader.js
AccountInfo.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const { ensureUserIsSignedIn } = require('utils/decorators');
const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');

let trackEditClick = (section) => {
    //Analytics
    let pageName = '';

    switch (section) {
        case 'email':
            pageName = ':my account:email:edit';
            break;
        default:
    }

    if (pageName) { //Prevent unnecessary tracking calls
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: ['event71'],
                linkName: digitalData.page.category.pageType + pageName,
                actionInfo: digitalData.page.category.pageType + pageName
            }
        });
    }
};

AccountInfo.prototype.ctrlr = function (user) {
    this.setAccountInfoState(user);
};

AccountInfo.prototype.setAccountInfoState = function (user) {
    this.setState({
        user: user
    });

    // subscribe to user to update name, email, or password display
    const userWatch = watch(store.getState, 'user');
    store.subscribe(userWatch(watched => {
        this.setState({
            user: watched
        });
    }));
};

AccountInfo.prototype.setEditSection = function (section) {
    this.setState({
        editSection: section
    });

    trackEditClick(section);
};

AccountInfo = ensureUserIsSignedIn(AccountInfo);


// Added by sephora-jsx-loader.js
module.exports = AccountInfo.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountInfo/AccountInfo.c.js