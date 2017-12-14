// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var MediaPopup = function () {};

// Added by sephora-jsx-loader.js
MediaPopup.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const cmsApi = require('services/api/cms');
const UI = require('utils/UI');

MediaPopup.prototype.ctrlr = function () {
    if (this.state.regions === null) {
        this.getMediaContent(this.props.mediaId);
    }
};

MediaPopup.prototype.getMediaContent = function (mediaId) {
    cmsApi.getMediaContent(mediaId).then(data => {
        this.setState({
            regions: data.regions
        });
    });
};

MediaPopup.prototype.requestClose = function () {
    if (this.props.onDismiss) {
        this.props.onDismiss();
        UI.preventBackgroundScroll(false);
    }
};

MediaPopup.prototype.componentWillReceiveProps = function (updatedProps) {
    this.setState({
        isOpen: updatedProps.isOpen
    });
    if (updatedProps.mediaId) {
        this.getMediaContent(updatedProps.mediaId);
    }
};


// Added by sephora-jsx-loader.js
module.exports = MediaPopup.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/MediaPopup/MediaPopup.c.js