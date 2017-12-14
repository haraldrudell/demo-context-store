// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EditMyProfileModal = function () {};

// Added by sephora-jsx-loader.js
EditMyProfileModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showEditMyProfileModal = require('actions/ProfileActions').showEditMyProfileModal;
const updateBiAccount = require('actions/ProfileActions').updateBiAccount;
const showInterstice = require('Actions').showInterstice;
const lithiumApi = require('services/api/thirdparty/Lithium');
const socialInfoActions = require('actions/SocialInfoActions');

const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const biUtils = require('utils/BiProfile');
// Categories Contents
const BioProfile = require('components/RichProfile/EditMyProfile/Content/BioProfile/BioProfile');
const Skin = require('components/RichProfile/EditMyProfile/Content/Skin/Skin');
const Hair = require('components/RichProfile/EditMyProfile/Content/Hair/Hair');
const Eyes = require('components/RichProfile/EditMyProfile/Content/Eyes/Eyes');
const ColorIQ = require('components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ');
const Birthday = require('components/RichProfile/EditMyProfile/Content/Birthday/Birthday');

const ALBUM_TITLES = {
    AVATAR: 'ProfilePicture',
    BACKGROUND: 'Background'
};

let avatarFile = null;
let backgroundFile = null;

EditMyProfileModal.prototype.ctrlr = function () {
    store.setAndWatch(
        [
            {
                'user.profileId': 'profileId'
            },
            {
                'user.nickName': 'nickname'
            },
            {
                'user.beautyInsiderAccount': 'biAccount'
            },
            {
                'socialInfo.socialProfile': 'socialProfile'
            },
            {
                'socialInfo.isLithiumSuccessful': 'isLithiumSuccessful'
            }
        ], this);
};

EditMyProfileModal.prototype.requestClose = function () {
    store.dispatch(showEditMyProfileModal(false));
};

/**
 * This function maps the current tab/modal with its content
 * @param {Integer} idx - The current tab/modal
 * @returns {Object} The content component
 */
EditMyProfileModal.prototype.getCategoryContent = function (idx) {
    switch (idx) {
        case 0:
            return BioProfile;
        case 1:
            return Skin;
        case 2:
            return Hair;
        case 3:
            return Eyes;
        case 4:
            return ColorIQ;
        case 5:
            return Birthday;
        default:
            return null;
    }
};

EditMyProfileModal.prototype.updateLithium = function (lithiumData, nickname) {
    const falsePromise = () => {
        return new Promise(resolve => resolve(false));
    };

    const shouldShowInterstice = () => {
        if (!store.getState().interstice.isVisible) {
            store.dispatch(showInterstice(true));
        }
    };

    let updateAvatar = falsePromise;
    let updateBackground = falsePromise;
    let updateBio = falsePromise;
    let updateInstagram = falsePromise;
    let updateYoutube = falsePromise;

    let descriptionOfEdits = [];
    let eventStrings = [];

    if (avatarFile !== lithiumData.avatarFile) {
        const imageFormData = this.createImageFormData(lithiumData.avatarFile);

        if (imageFormData) {
            updateAvatar = () => {
                shouldShowInterstice();
                return lithiumApi
                    .getUserAlbums(nickname)
                    .then(albums => this.getAlbum(albums, ALBUM_TITLES.AVATAR))
                    .then(album => lithiumApi.uploadImageToAlbum(album.album.id.$, imageFormData))
                    .then(image => lithiumApi.updateUserSocialAvatar(image.image.url.$, nickname))
                    .then(this.setAvatarFile(lithiumData.avatarFile));
            };
        }
    }

    if (backgroundFile !== lithiumData.backgroundFile) {
        const imageFormData = this.createImageFormData(lithiumData.backgroundFile);

        if (imageFormData) {
            updateBackground = () => {
                shouldShowInterstice();
                return lithiumApi
                    .getUserAlbums(nickname)
                    .then(albums => this.getAlbum(albums, ALBUM_TITLES.BACKGROUND))
                    .then(album => lithiumApi.uploadImageToAlbum(album.album.id.$, imageFormData))
                    .then(image =>
                        lithiumApi.updateUserSocialBackground(image.image.url.$, nickname))
                    .then(this.setBackgroundFile(lithiumData.backgroundFile));
            };
        }
    }

    if (this.state.socialProfile.aboutMe !== lithiumData.aboutMe) {
        updateBio = function () {
            shouldShowInterstice();
            return lithiumApi.updateUserSocialBio(lithiumData.aboutMe, nickname);
        };
    }

    if (this.state.socialProfile.instagram !== lithiumData.instagram) {
        updateInstagram = function () {
            shouldShowInterstice();
            if (lithiumData.instagram.indexOf('http://') === 0) {
                lithiumData.instagram = lithiumData.instagram.replace('http://', 'https://');
            } else if (lithiumData.instagram.indexOf('https') !== 0 &&
                lithiumData.instagram.length) {
                lithiumData.instagram = 'https://' + lithiumData.instagram;
            }

            return lithiumApi.updateUserSocialInstagram(
                lithiumData.instagram,
                nickname);
        };
    }

    if (this.state.socialProfile.youtube !== lithiumData.youtube) {
        updateYoutube = function () {
            shouldShowInterstice();
            if (lithiumData.youtube.indexOf('http://') === 0) {
                lithiumData.youtube = lithiumData.youtube.replace('http://', 'https://');
            } else if (lithiumData.instagram.indexOf('https') !== 0 &&
                lithiumData.instagram.length) {
                lithiumData.youtube = 'https://' + lithiumData.youtube;
            }

            return lithiumApi.updateUserSocialYoutube(
                lithiumData.youtube,
                nickname);
        };
    }

    // set up promise so that after all updates are made then
    // we make a getAuthenticatedUserSocialInfo call
    Promise.all([
        updateAvatar(),
        updateBackground(),
        updateBio(),
        updateInstagram(),
        updateYoutube()
    ])
        .then(values => {
            let [
                isUpdateAvatar,
                isUpdateBackground,
                isUpdateBio,
                isUpdateInstagram,
                isUpdateYoutube
            ] = values;

            if (isUpdateAvatar ||
                isUpdateBackground ||
                isUpdateBio ||
                isUpdateInstagram ||
                isUpdateYoutube) {
                lithiumApi.getAuthenticatedUserSocialInfo(this.state.nickname).then((data) => {
                    store.dispatch(socialInfoActions.setUserSocialInfo(data));
                    store.dispatch(showInterstice(false));
                });
            }

            //Analytics - Track if photo, bio or both were updated.
            if (isUpdateBio) {
                descriptionOfEdits.push('edit about me text');
                eventStrings.push(analyticsConsts.Event.EDIT_ABOUT_ME_TEXT);
            }

            if (isUpdateAvatar) {
                descriptionOfEdits.push('upload profile photo');
                eventStrings.push(analyticsConsts.Event.UPLOAD_PROFILE_PHOTO);
            }

            if (descriptionOfEdits.length) {

                let linkName = [
                    digitalData.page.category.pageType,
                    digitalData.page.pageInfo.pageName,
                    descriptionOfEdits.join(' ')
                ].join(':');

                processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                    data: {
                        actionInfo: linkName,
                        linkName,
                        eventStrings: [analyticsConsts.Event.EVENT_71].concat(eventStrings),
                        usePreviousPageName: true
                    }
                });
            }

        })
        .catch(() => {
            if (store.getState().interstice.isVisible) {
                store.dispatch(showInterstice(false));
            }
        });
};

EditMyProfileModal.prototype.setAvatarFile = function (avatar) {
    return new Promise(resolve => {
        avatarFile = avatar;
        resolve();
    });
};

EditMyProfileModal.prototype.setBackgroundFile = function (background) {
    return new Promise(resolve => {
        backgroundFile = background;
        resolve();
    });
};

/**
 * 1. Search for the album in the albums data
 * 2. Create the album if it cannot find it
 * @param  {Object} data - The albums' data
 * @param  {String} albumTitle - The title of the album
 * @returns {Promise}
 */
EditMyProfileModal.prototype.getAlbum = function (data, albumTitle) {
    let albums = [];

    if (data.albums && data.albums.album) {
        albums = data.albums.album.filter(response => {
            return response.title.$ === albumTitle;
        });
    }

    if (albums.length) {
        return new Promise(resolve => resolve({
            album: albums[0]
        }));
    } else {
        return lithiumApi.createAlbum(albumTitle);
    }
};

/**
 * Create a FormData object with the image file content
 * @param  {File} imageContent - The image file content
 * @returns {FormData}
 */
EditMyProfileModal.prototype.createImageFormData = function (imageContent) {
    const IMAGE_REG_EX = /image\/*\w+/g;

    // Return false if file is not an image
    if (!imageContent || !imageContent.type.match(IMAGE_REG_EX)) {
        return false;
    }

    let formData = new FormData();

    formData.append('image.content', imageContent);

    return formData;
};

EditMyProfileModal.prototype.saveProfileCallback = function (
    profileData,
    callback,
    isLithiumUpdate
) {

    if (isLithiumUpdate) {
        this.updateLithium(profileData, this.state.nickname);
    } else {
        // Get the bi data that is already saved
        let finalObject = biUtils.completeProfileObject(profileData.biAccount.
                personalizedInformation, this.state.biAccount.personalizedInformation);

        profileData.biAccount.personalizedInformation = finalObject;
        profileData.profileId = this.state.profileId;
        store.dispatch(updateBiAccount(profileData, callback));
    }
};


// Added by sephora-jsx-loader.js
module.exports = EditMyProfileModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Modals/EditMyProfileModal/EditMyProfileModal.c.js