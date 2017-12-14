// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiHQ = function () {};

// Added by sephora-jsx-loader.js
BiHQ.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const userUtils = require('utils/User');
const cmsApi = require('services/api/cms');
const BIHQ_MEDIA_ID = '43900058';
const anaConstants = require('analytics/constants');

BiHQ.prototype.ctrlr = function () {
    cmsApi.getMediaContent(BIHQ_MEDIA_ID).then(data => {
        this.setState({
            contentData: data.regions.content
        });
    });
    store.setAndWatch('user', null, (data) => {
        this.setState({
            user: data.user,
            isUserBi: userUtils.isBI(),
            isAnonymous: userUtils.isAnonymous()
        });
    });

    //Analytics
    digitalData.page.pageInfo.pageName = 'my beauty insider:benefits';
    digitalData.page.category.pageType = anaConstants.PAGE_TYPES.USER_PROFILE;
};


// Added by sephora-jsx-loader.js
module.exports = BiHQ.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiHQ/BiHQ.c.js