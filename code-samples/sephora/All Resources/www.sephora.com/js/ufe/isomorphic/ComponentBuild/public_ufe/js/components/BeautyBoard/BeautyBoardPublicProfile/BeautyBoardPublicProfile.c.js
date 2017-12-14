// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BeautyBoardPublicProfile = function () {};

// Added by sephora-jsx-loader.js
BeautyBoardPublicProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const olapicApi = require('services/api/thirdparty/Olapic');
const olapicLovesApi = require('services/api/thirdparty/OlapicLoves');
const { getPublicUserSocialInfo } = require('services/api/thirdparty/Lithium');
const userUtils = require('utils/User');
const { getFullLooks } = require('utils/BeautyBoard');
const olapicUtils = require('utils/Olapic');

const MEDIA_PAGE_SIZE = 10; // TODO Figure out a nice name.

BeautyBoardPublicProfile.prototype.ctrlr = function () {
    // Although there is the OlapicComponent on the page, having this line here
    // will significantly reduce the first response time.
    olapicUtils.enableLightbox();

    // (!) These page numbers need to be at the top of this method. Otherwise,
    // the requests are going to fail because of &page_number=NaN.
    this._userLooksPageNumber = 0;
    this._userLovedLooksPageNumber = 0;

    // (!) Same with this.
    this._userPublicId = BeautyBoardPublicProfile.
        getPublicIdFromPublicAlbumUrl(window.location.pathname);

    let getUserNickname =
            profileApi.getProfileIdentifiersByPublicId(this._userPublicId).
                then(data => data.nickName);

    let getUserLooksTotalNumber = getUserNickname.
            then(userNickname =>
                olapicApi.getUserPhotosNum(this._userPublicId, userNickname));

    let getUserLovedLooksTotalNumber =
            olapicLovesApi.getLovedPhotosNum(this._userPublicId);

    // (!) Splitting these pages to setState separately will result into an
    // esoteric glitch where the first page to load will be in both carousels.
    // Debugging that would tell nothing and the issue would look either as
    // a React bug, or UFE framework bug, or even javascript bug.
    Promise.all([
        this.getNextUserLooksPage(),
        this.getNextUserLovedLooksPage(),
        getUserLooksTotalNumber,
        getUserLovedLooksTotalNumber
    ]).
    then(values => {
        let [
            initialUserLooks,
            initialUserLovedLooks,
            userLooksTotalNumber,
            userLovedLooksTotalNumber
        ] = values;

        this.setState({
            initialUserLooks,
            initialUserLovedLooks,
            userLooksTotalNumber,
            userLovedLooksTotalNumber
        });
    });

    let getSocialInfo = getUserNickname.
            then(userNickname => getPublicUserSocialInfo(userNickname));


    Promise.all([getUserNickname, getSocialInfo]).then(values => {
        let [userNickname, socialInfo] = values;

        this.setState({
            userNickname,
            avatarUrl: socialInfo.socialProfile.avatar,
            biBadgeUrl: socialInfo.socialProfile.biBadgeUrl,
            engagementBadgeUrl: socialInfo.socialProfile.engagementBadgeUrl
        });
    });
};

BeautyBoardPublicProfile.prototype.getNextUserLooksPage = function () {
    let pageNumber = this._userLooksPageNumber + 1;

    let getUserNickname =
            profileApi.getProfileIdentifiersByPublicId(this._userPublicId).
                then(data => data.nickName);

    let getMedia = getUserNickname.
            then(userNickname => olapicApi.getUserMedia(
                    this._userPublicId, userNickname, pageNumber,
                    MEDIA_PAGE_SIZE)).
            then(data => {
                this._userLooksPageNumber = pageNumber;
                return data;
            });

    return getMedia.then(media => getFullLooks(media));
};

BeautyBoardPublicProfile.prototype.getNextUserLovedLooksPage = function () {
    let pageNumber = this._userLovedLooksPageNumber + 1;

    let getLovedMedia = olapicLovesApi.getUsersLovedMedia(
                this._userPublicId, pageNumber, MEDIA_PAGE_SIZE).
            then(data => {
                this._userLovedLooksPageNumber = pageNumber;
                return data;
            });

    return getLovedMedia.then(media => getFullLooks(media));
};

BeautyBoardPublicProfile.getPublicIdFromPublicAlbumUrl = function (url) {
    // https://sephora.com/community/gallery/album/56690029
    return url.split('/').pop();
};


// Added by sephora-jsx-loader.js
module.exports = BeautyBoardPublicProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BeautyBoard/BeautyBoardPublicProfile/BeautyBoardPublicProfile.c.js