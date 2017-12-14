// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var UploadMedia = function () {};

// Added by sephora-jsx-loader.js
UploadMedia.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const bvService = require('services/api/thirdparty/BazaarVoice');

UploadMedia.prototype.ctrlr = function () {};

UploadMedia.prototype.handleUpload = function (e, pickerKey) {
    if (e.target.files.length) {
        let file = e.target.files[0];
        let newMediaContainer = Object.assign({}, this.state.media);
        bvService.uploadPhoto(file).then((photo) => {
            if (photo.errors) {
                this.setState({ errors: photo.errors });
                return;
            }

            newMediaContainer[pickerKey] = photo.thumbnailUrl;
            this.setState({
                hasMedia: true,
                media: newMediaContainer,
                errors: []
            }, () => {
                this.props.onChange(newMediaContainer);
            });
        }).catch((error) => {
            if (!error.apiFailed) {
                this.setState({ errors: error.errors });
            }
            // TODO: React on Upload Photo errors
        });
    }
};

UploadMedia.prototype.removeMedia = function(evt, key) {
    let newMediaContainer = Object.assign({}, this.state.media);
    let mediaKeys = Object.keys(newMediaContainer);
    if ((key = mediaKeys[0]) && mediaKeys.length > 1) {
        let otherKey = mediaKeys[1];
        newMediaContainer[key] = newMediaContainer[otherKey];
        delete newMediaContainer[otherKey];
    } else {
        delete newMediaContainer[key];
    }
    let newHasMedia = mediaKeys.length > 0 ? true : false;
    this.setState({
        hasMedia: newHasMedia,
        media: newMediaContainer
    }, () => {
        this.props.onChange(newMediaContainer);
    });
};


// Added by sephora-jsx-loader.js
module.exports = UploadMedia.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/UploadMedia/UploadMedia.c.js