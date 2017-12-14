// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PrivateProfile = function () {};

// Added by sephora-jsx-loader.js
PrivateProfile.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const { ensureUserIsAtLeastRecognized } = require('utils/decorators');
const lithiumApi = require('services/api/thirdparty/Lithium');
const olapicApi = require('services/api/thirdparty/Olapic');
const bazaarVoiceApi = require('services/api/thirdparty/BazaarVoice');
const biApi = require('services/api/beautyInsider');
const store = require('Store');
const watch = require('redux-watch');
const REVIEW_LIMIT = Sephora.isMobile() ? 1 : 2;
const { NUM_LOOKS_ON_DESKTOP, NUM_LOOKS_ON_MOBILE } = require('../settings');
const userUtils = require('utils/User');
const auth = require('utils/Authentication');

PrivateProfile.prototype.ctrlrAsync = function (user, done) {
    let getUserPhotosNum;
    let getSocialInfo;
    let getLooks;
    let biAccount = user.beautyInsiderAccount;
    let socialInfoWatch = watch(store.getState, 'socialInfo');
    let biInfoWatch = watch(store.getState, 'user.beautyInsiderAccount');

    function getFeaturedLooks() {
        return olapicApi.getFeaturedMedia().
            then(media => {
                return {
                    isFeaturedLooks: true,
                    media
                };
            });
    }

    if (user.nickName) {
        getUserPhotosNum = function () {
            return olapicApi.getUserPhotosNum(user.publicId, user.nickName);
        };

        getLooks = function () {
            return olapicApi.getUserMedia(user.publicId, user.nickName, 1).
                then(media => {
                    let result;
                    if (media.length) {
                        result = {
                            isFeaturedLooks: false, media
                        };
                    } else {
                        result = getFeaturedLooks();
                    }
                    return result;
                });
        };

        getSocialInfo = userUtils.getSocialInfo;

    } else {
        getUserPhotosNum = function () {
            return Promise.resolve(0);
        };

        getSocialInfo = function () {
            return lithiumApi.getNoNicknameUserSocialInfo();
        };

        getLooks = getFeaturedLooks;
    }

    let getUserReviews =
        bazaarVoiceApi.getUserReviews(user.profileId, REVIEW_LIMIT);

    let getRecentPurchases = biAccount ?
        biApi.getPurchaseHistory(user.profileId).
            then(PrivateProfile.adaptPurchaseHistoryFromAPI) :
        Promise.reject();

    getUserReviews.then(userReviews => {
        this.setState({ userReviews });
    });

    getRecentPurchases.then(recentPurchases => {
        this.setState({ recentPurchases });
    });

    getLooks().then(looksData => {
        looksData.media = looksData.media.slice(0,
            Sephora.isMobile() ? NUM_LOOKS_ON_MOBILE : NUM_LOOKS_ON_DESKTOP);

        this.setState({ looksData });
    });

    getUserPhotosNum().then(numUserPhotos => {
        this.setState({
            numUserPhotos
        });
    });

    getSocialInfo().then(socialInfo => {
        this.setState({
            socialInfo,
            biAccount,
            user
        });

        /* eslint-disable no-shadow */
        store.subscribe(biInfoWatch(biAccount => {
            this.setState({ biAccount });
        }));

        /* eslint-disable no-shadow */
        store.subscribe(socialInfoWatch(socialInfo => {
            this.setState({ socialInfo });
        }));

        done();
    }).

    catch(reason => {
        this.props.handleError();
        done();
    });
};

PrivateProfile.adaptPurchaseHistoryFromAPI = function (purchasedHistory) {
    let recentPurchases = [];
    if (purchasedHistory.purchasedGroups.length) {
        let purchasedGroup;
        let item;
        let allowedLength = Sephora.isMobile() ? 2 : 4;
        for (let i = 0; i < purchasedHistory.purchasedGroups.length; i++) {
            purchasedGroup = purchasedHistory.purchasedGroups[i];
            if (recentPurchases.length === allowedLength) {
                break;
            } else {
                for (let j = 0; j < purchasedGroup.purchasedItems.length; j++) {
                    item = purchasedGroup.purchasedItems[j];
                    let isValidItem = !item.sku.biType &&
                        item.sku.type !== 'Flash SKU' &&
                        item.sku.type !== 'Gift Card' &&
                        item.sku.type !== 'Sample';

                    if (isValidItem) {
                        recentPurchases.push(item);
                    }

                    if (recentPurchases.length === allowedLength) {
                        break;
                    }
                }
            }
        }
    }
    return recentPurchases.length ? recentPurchases : null;
};

//used for empty state
PrivateProfile.prototype.signInHandler = function () {
    auth.requireAuthentication().then(() => {
        //hide the please sign in block immediately after user signs in
        this.setState({
            showPleaseSignInBlock: false
        });
    });
};

PrivateProfile = ensureUserIsAtLeastRecognized(PrivateProfile);


// Added by sephora-jsx-loader.js
module.exports = PrivateProfile.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/PrivateProfile/PrivateProfile.c.js