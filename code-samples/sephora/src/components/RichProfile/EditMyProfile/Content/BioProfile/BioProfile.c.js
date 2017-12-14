// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BioProfile = function () {};

// Added by sephora-jsx-loader.js
BioProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
/*eslint no-bitwise: ["error", { "allow": ["&"] }] */
const imageUtil = require('utils/Image.js');

BioProfile.prototype.getData = function () {
    let dataObj = {
        aboutMe: this.aboutMe.getValue(),
        instagram: this.instagramLink.getValue().trim(),
        youtube: this.youtubeLink.getValue().trim(),
        avatarFile: this.state.avatarFile,
        backgroundFile: this.state.backgroundFile,
        avatar: this.state.avatar,
        background: this.state.background
    };
    return dataObj;
};

BioProfile.prototype.handleAvatarUpload = function (e) {
    if (e.target.files.length) {
        const file = e.target.files[0];
        this.replaceImage(file, event => {
            this.setState({
                avatar: event,
                avatarFile: file
            });
        });
    }
};

BioProfile.prototype.handleBackgroundUpload = function (e) {
    if (e.target.files.length) {
        const file = e.target.files[0];
        this.replaceImage(file, event => {
            this.setState({
                background: event,
                backgroundFile: file
            });
        });
    }
};

BioProfile.prototype.replaceImage = function (file, callback) {
    const fileReader = new FileReader();
    fileReader.onload = event => {
        if (typeof callback === 'function') {
            imageUtil.resetOrientation(event.target.result, file, function (correctImage) {
                callback(correctImage);
            });
        }
    };
    fileReader.readAsDataURL(file);
};


// Added by sephora-jsx-loader.js
module.exports = BioProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/BioProfile/BioProfile.c.js