// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PostingConfirmation = function () {};

// Added by sephora-jsx-loader.js
PostingConfirmation.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const cmsApi = require('services/api/cms');
const MEDIA_ID = 44400022;

PostingConfirmation.prototype.ctrlr = function () {
    cmsApi.getMediaContent(MEDIA_ID).then(data => {
        this.setState({ contentData: data && data.regions && data.regions.content ?
            data.regions.content : null });
    });
};

PostingConfirmation.prototype.componentWillReceiveProps = function (updatedProps) {
    this.setState(updatedProps);
};


// Added by sephora-jsx-loader.js
module.exports = PostingConfirmation.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/PostingConfirmation/PostingConfirmation.c.js