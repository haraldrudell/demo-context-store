// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var LookCard = function () {};

// Added by sephora-jsx-loader.js
LookCard.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const olapicUtils = require('utils/Olapic');
const olapicLovesApi = require('services/api/thirdparty/OlapicLoves');
const olapicApi = require('services/api/thirdparty/Olapic');
const store = require('store/Store');
const Actions = require('actions/Actions');
const userUtils = require('utils/User');

LookCard.prototype.handleClick = function () {
    olapicUtils.openLightbox(this.state.look.medium.id);
};

LookCard.prototype.handleHeartClick = function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.isLoved) {
        olapicLovesApi.unloveMedium(this.state.look.medium.id).
            then(() => this.setState({
                isLoved: false,
                numLoves: this.state.numLoves - 1
            }));
    } else {
        olapicLovesApi.loveMedium(this.state.look.medium.id).
            then(() => this.setState({
                isLoved: true,
                numLoves: this.state.numLoves + 1
            }));
    }
};

LookCard.prototype.heartHover = function () {
    if (!Sephora.isTouch) {
        this.setState({ isHeartHover: !this.state.isHeartHover });
    }
};

LookCard.prototype.deleteMediaById = function () {
    let mediaId = this.state.look._data.medium.id;
    let publicId = userUtils.getPublicId();
    olapicApi.deleteOlapicMediaById(mediaId, publicId);
};

LookCard.prototype.launchDeleteLookModal = function () {
    //variable declaration here for clarity
    let message = '<p>Are you sure you want to delete this look? ' +
        'Once deleted your look and all details will be permanently removed.</p>';
    let confirmButtonText = 'Delete';
    let callback = this.deleteMediaById;
    let hasCancelButton = true;
    let cancelButtonText = 'Cancel';
    let isMessageHtml = true;
    let confirmMsgObj = {
        title: null,
        message: '<p>This look has been successfully deleted. ' +
            'Please allow one hour for the look to be removed.</p>'
    };

    store.dispatch(
        Actions.showInfoModal(
            true,
            null,
            message,
            confirmButtonText,
            callback,
            hasCancelButton,
            cancelButtonText,
            isMessageHtml,
            confirmMsgObj
        )
    );
};


// Added by sephora-jsx-loader.js
module.exports = LookCard.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/LookCard/LookCard.c.js