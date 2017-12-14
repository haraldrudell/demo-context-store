// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var OlapicComponent = function () {};

// Added by sephora-jsx-loader.js
OlapicComponent.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const olapicUtils = require('utils/Olapic');

OlapicComponent.prototype.ctrlr = function () {

    olapicUtils.includeOlapicScripts();

    if (this.props.name === olapicUtils.OlapicComponentName.UPLOADER) {
        olapicUtils.startUploader(this.props.containerId);
    } else if (this.props.name === olapicUtils.OlapicComponentName.GALLERY) {
        olapicUtils.startGallery(this.props.containerId);
    }
};


// Added by sephora-jsx-loader.js
module.exports = OlapicComponent.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/OlapicComponent/OlapicComponent.c.js