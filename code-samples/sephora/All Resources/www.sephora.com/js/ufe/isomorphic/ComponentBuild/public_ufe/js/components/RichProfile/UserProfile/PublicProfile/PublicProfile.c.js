// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PublicProfile = function () {};

// Added by sephora-jsx-loader.js
PublicProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile');
const lithiumApi = require('services/api/thirdparty/Lithium');
const olapicApi = require('services/api/thirdparty/Olapic');
const bazaarVoiceApi = require('services/api/thirdparty/BazaarVoice');
const REVIEW_LIMIT = Sephora.isMobile() ? 1 : 2;
const userUtils = require('utils/User');
const store = require('Store');
const {
 NUM_LOOKS_ON_DESKTOP, NUM_LOOKS_ON_MOBILE
} = require('../settings');

//TODO: ILLUPH-88897 create a catch for getPublicUserProfile if errorCode 404 exists
PublicProfile.prototype.ctrlr = function () {
    profileApi.getProfileIdentifiersByNickname(this.props.nickname).then(data => {
        let getUserPhotosNum = olapicApi.getUserPhotosNum(data.publicId, data.nickName);
        let getUserReviews = bazaarVoiceApi.getUserReviews(data.profileId, REVIEW_LIMIT);
        let getPublicUserProfile = profileApi.getPublicProfileByNickname(data.nickName);
        let getUserOlapicMedia = olapicApi.getUserMedia(data.publicId, data.nickname, 1);

        let loggedInUser = store.getState().user;
        let getSocialInfo;
        if (loggedInUser.profileStatus === 0 || !loggedInUser.nickName) {
            getSocialInfo = lithiumApi.getPublicUserSocialInfo(data.nickName);
        } else {
            getSocialInfo = lithiumApi.getAuthenticatedUserSocialInfo(data.nickName);
        }

        //wait for social info.  If social info is unavailable, then show error page
        getSocialInfo.then(socialInfo => {
            Promise.all([
                getUserPhotosNum,
                getUserOlapicMedia]).then(values => {

                    let [
                   numUserPhotos,
                   looksMedia
                ] = values;

                    looksMedia = looksMedia.slice(0,
                    Sephora.isMobile() ? NUM_LOOKS_ON_MOBILE : NUM_LOOKS_ON_DESKTOP);

                    this.setState({
                        numUserPhotos,
                        looksMedia
                    });
                }).catch(error => {
                    this.setState({ numUserPhotos: 0 });
                    return error;
                });

            getUserReviews.then(userReviews =>
                this.setState({ userReviews })
            ).catch(error => {
                done();
            });

            getPublicUserProfile.then(user => {

                this.setState({
                    socialInfo,
                    user,
                    profileId: data.profileId,
                    publicId: data.publicId,
                    isBeingFollowed: socialInfo.socialProfile.isBeingFollowed,
                    followerCount: socialInfo.socialProfile.follower,
                    loggedInUser: loggedInUser
                });
            });

        }).catch(reason => {
            this.props.handleError();
        });
    });

    //Analytics
    digitalData.page.category.pageType = 'cmnty profile';
    digitalData.page.pageInfo.pageName = 'user-profile';
};

PublicProfile.prototype.handleFollowClick = function() {

    let currentUser = store.getState().user;
    this.setState({ isFollowButtonDisabled: true });

    if (userUtils.isSocial() && !userUtils.isAnonymous()) {
        if (this.state.isBeingFollowed) {
            lithiumApi.unfollowUser(
                currentUser.nickName,
                this.state.socialInfo.socialProfile.id
            ).then(() => {
                this.setState({
                    followerCount: parseInt(this.state.followerCount) - 1,
                    isBeingFollowed: false,
                    isFollowButtonDisabled: false
                });
            });
        } else {
            lithiumApi.followUser(
                currentUser.nickName,
                this.state.socialInfo.socialProfile.id
            ).then(() => {
                this.setState({
                    followerCount: parseInt(this.state.followerCount) + 1,
                    isBeingFollowed: true,
                    isFollowButtonDisabled: false
                });
            });
        }
    }
};


// Added by sephora-jsx-loader.js
module.exports = PublicProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/PublicProfile/PublicProfile.c.js