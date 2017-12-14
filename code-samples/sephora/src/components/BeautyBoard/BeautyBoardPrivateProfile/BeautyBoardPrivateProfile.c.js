// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BeautyBoardPrivateProfile = function () {};

// Added by sephora-jsx-loader.js
BeautyBoardPrivateProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const { ensureUserIsAtLeastRecognized } = require('utils/decorators');
const olapicApi = require('services/api/thirdparty/Olapic');
const olapicLovesApi = require('services/api/thirdparty/OlapicLoves');
const userUtils = require('utils/User');
const { getFullLooks } = require('utils/BeautyBoard');
const olapicUtils = require('utils/Olapic');

const MEDIA_PAGE_SIZE = 10; // TODO Figure out a nice name.

BeautyBoardPrivateProfile.prototype.ctrlr = function (user) {
    // Although there is the OlapicComponent on the page, having this line here
    // will significantly reduce the first response time.
    olapicUtils.enableLightbox();

    // (!) These page numbers need to be at the top of this method. Otherwise,
    // the requests are going to fail because of &page_number=NaN.
    this._myLooksPageNumber = 0;
    this._myLovedLooksPageNumber = 0;

    let getMyLooksTotalNumber =
            olapicApi.getUserPhotosNum(user.publicId, user.nickName);

    let getMyLovedLooksTotalNumber =
            olapicLovesApi.getLovedPhotosNum(user.publicId);

    // (!) Splitting these pages to setState separately will result into an
    // esoteric glitch where the first page to load will be in both carousels.
    // Debugging that would tell nothing and the issue would look either as
    // a React bug, or UFE framework bug, or even javascript bug.
    Promise.all([
        this.getNextMyLooksPage(),
        this.getNextMyLovedLooksPage(),
        getMyLooksTotalNumber,
        getMyLovedLooksTotalNumber
    ]).
    then(values => {
        let [
            initialMyLooks,
            initialMyLovedLooks,
            myLooksTotalNumber,
            myLovedLooksTotalNumber
        ] = values;

        this.setState({
            initialMyLooks,
            initialMyLovedLooks,
            myLooksTotalNumber,
            myLovedLooksTotalNumber
        });
    });

    let getSocialInfo = userUtils.getSocialInfo();

    getSocialInfo.then(socialInfo => {
        this.setState({
            userNickname: user.nickName,
            avatarUrl: socialInfo.socialProfile.avatar,
            biBadgeUrl: socialInfo.socialProfile.biBadgeUrl,
            engagementBadgeUrl: socialInfo.socialProfile.engagementBadgeUrl
        });
    });
};

BeautyBoardPrivateProfile.prototype.getNextMyLooksPage = function () {
    // (!) this.state.user may not be available at the time that getMedia gets
    // called. That's why we need to wait for the user first.
    // This can't be a class method because class methods defined on c.js are
    // not available on jsx.

    let pageNumber = this._myLooksPageNumber + 1;

    let getOlapicMedia = userUtils.getUser().
            then(user => olapicApi.getUserMedia(
                    user.publicId, user.nickName, pageNumber, MEDIA_PAGE_SIZE)).
            then(data => {
                this._myLooksPageNumber = pageNumber;
                return data;
            });

    return getOlapicMedia.then(media => getFullLooks(media));
};

BeautyBoardPrivateProfile.prototype.getNextMyLovedLooksPage = function () {
    let pageNumber = this._myLovedLooksPageNumber + 1;

    let getLovedMedia = userUtils.getUser().
            then(user => olapicLovesApi.getUsersLovedMedia(
                    user.publicId, pageNumber, MEDIA_PAGE_SIZE)).
            then(data => {
                this._myLovedLooksPageNumber = pageNumber;
                return data;
            });

    return getLovedMedia.then(media => getFullLooks(media));
};

BeautyBoardPrivateProfile =
    ensureUserIsAtLeastRecognized(BeautyBoardPrivateProfile);


// Added by sephora-jsx-loader.js
module.exports = BeautyBoardPrivateProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/BeautyBoardPrivateProfile/BeautyBoardPrivateProfile.c.js