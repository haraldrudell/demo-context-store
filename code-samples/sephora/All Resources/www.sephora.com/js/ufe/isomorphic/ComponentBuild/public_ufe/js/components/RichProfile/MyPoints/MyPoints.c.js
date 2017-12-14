// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MyPoints = function () {};

// Added by sephora-jsx-loader.js
MyPoints.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const decorators = require('utils/decorators');
const ensureUserIsAtLeastRecognized = decorators.ensureUserIsAtLeastRecognized;
const userUtils = require('utils/User');
const store = require('Store');
const anaConstants = require('analytics/constants');

MyPoints.prototype.ctrlr = function () {
    store.setAndWatch('user', null, data => {
        this.setState({
            isUserBi: userUtils.isBI(),
            isAnonymous: userUtils.isAnonymous(),
            user: data.user
        });
    });

    //Analytics
    digitalData.page.pageInfo.pageName = 'my beauty insider:activity';
    digitalData.page.category.pageType = anaConstants.PAGE_TYPES.USER_PROFILE;
};

MyPoints = ensureUserIsAtLeastRecognized(MyPoints);


// Added by sephora-jsx-loader.js
module.exports = MyPoints.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyPoints/MyPoints.c.js