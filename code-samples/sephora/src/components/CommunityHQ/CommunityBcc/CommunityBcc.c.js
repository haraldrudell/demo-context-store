// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CommunityBcc = function () {};

// Added by sephora-jsx-loader.js
CommunityBcc.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const cmsApi = require('services/api/cms');
const BCC_MEDIA_ID = '43900060';

CommunityBcc.prototype.ctrlr = function () {
    cmsApi.getMediaContent(BCC_MEDIA_ID).then(data => {
        this.setState({
            contentData: data.regions.content
        });
    });

    //Analytics
    digitalData.page.category.pageType = 'cmnty';
    digitalData.page.pageInfo.pageName = 'home';
};


// Added by sephora-jsx-loader.js
module.exports = CommunityBcc.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CommunityHQ/CommunityBcc/CommunityBcc.c.js