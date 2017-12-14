const store = require('Store');
const profileActions = require('actions/ProfileActions');
const userUtils = require('utils/User');
const authentication = require('utils/Authentication');
const actions = require('actions/Actions');
const urlUtils = require('utils/Url');

const communitySiteHost = Sephora.configurationSettings.communitySiteHost;
const TOKY_AUTH_COOKIE_NAME = 'toky_auth_sso';

// tokywoky set to 'olapic', because api call requires a social provider
// but only accepts either 'lithium', 'olapic', or 'bv'
let PROVIDER_TYPES = {
    lithium: 'lithium',
    olapic: 'olapic',
    bv: 'bv',
    tokywoky: 'olapic'
};

let COMMUNITY_URLS = {
    CONVERSATIONS: `//${communitySiteHost}/t5/user/viewprofilepage/user-id/`,
    GROUPS: `//${communitySiteHost}/t5/custom/page/page-id/GroupsLandingPage`,
    PUBLIC_LOOKS_PROFILE: '/community/gallery/album/',
    MY_LOOKS_PROFILE: '/community/gallery/myprofile',
    ADD_PHOTO: '/community/gallery/add-photo',
    GALLERY: '/community/gallery',
    LANDING_PAGE: '/community'
};

let showRegistrationModal = () => {
    return new Promise((resolve, reject) => {
        store.dispatch(actions.showRegisterModal(
            true, null, resolve, null, null, null, reject
        ));
    });
};

let showBiRegisterModal = () => {
    return new Promise((resolve, reject) => {
        store.dispatch(actions.showBiRegisterModal(
            true, resolve, true, reject
        ));
    });
};

// provider type arg is required for social register api call, it fails without it
// if socialProvider comes in as null, set it to lithium as default
let showSocialRegistrationModal = (socialProvider = PROVIDER_TYPES.lithium) => {
    return new Promise((resolve, reject) => {
        store.dispatch(profileActions.showSocialRegistrationModal(
            true, userUtils.isBI(), resolve, socialProvider, reject
        ));
    });
};

let showSocialReOptModal = () => {
    return new Promise((resolve, reject) => {
        store.dispatch(profileActions.showSocialReOptModal(
            true, resolve, reject
        ));
    });
};

/**
 * user must be atleast recognized to launch social action
 * user must be fully signed in before launching any social registration modal
 * if user is not bi but is social, we launch bi registration modal
 * if user is not social, we launch social registration modal
 * if user needs to re opt their current social user, we launch the re opt modal
 * otherwise, we launch the social action
 * you can see how ensureUserIsReadyForSocialAction is implemented in:
 *  - AddReview/AddReviewCarousel/AddReviewCarousel.c.js
 *  - RichProfile/UserProfile/common/AboutMeSlideShow/AboutMeSlideshow.c.js
 */
let ensureUserIsReadyForSocialAction = function (socialProvider) {

    return authentication.requireRecognizedAuthentication().then(() => {
        let promise = Promise.resolve();

        if (!userUtils.isBI() && userUtils.isSocial()) {
            promise = authentication.requireLoggedInAuthentication().
                then(() => showBiRegisterModal());

        } else if (!userUtils.isSocial()) {
            promise = authentication.requireLoggedInAuthentication().
                then(() => showSocialRegistrationModal(socialProvider));

        } else if (userUtils.needsSocialReOpt()) {
            promise = authentication.requireLoggedInAuthentication().
                then(() => showSocialReOptModal());
        }

        return promise;
    }).
    catch(reason => {
        console.debug('oops! user sign in required');
        return Promise.reject(reason);
    });
};


let socialCheckLink = function (url, socialProvider) {
    ensureUserIsReadyForSocialAction(socialProvider).
        then(() => {
            urlUtils.redirectTo(url);
        });
};

let tokyWokySignIn = function () {
    return new Promise((resolve, reject) => {
        if (window.toky) {
            const tokyWokyApi = require('services/api/thirdparty/tokyWoky');
            tokyWokyApi.getTokyWokySSOToken().then(data => {
                let tokyAuthData =
                    `${data.tokyWokyAuthPublicKey}:${data.tokyWokyAuthMessage}:` +
                    `${data.tokyWokyAuthHmac}:${data.tokyWokyAuthTimestamp}`;
                toky.utils.createCookie(TOKY_AUTH_COOKIE_NAME, tokyAuthData, 0);
                resolve();
            }).catch(reject);
        } else {
            reject();
        }
    });
};

//used for when user tries to signin from a lithium hosted page
let launchSocialSignInFlow = function () {
    Sephora.TokyWoky ? Sephora.TokyWoky.CommunitySignIn = true
        : Sephora.TokyWoky = { CommunitySignIn: true };

    //re-using ensureUserIsReadyForSocialAction since sign in flow is the same
    return ensureUserIsReadyForSocialAction().
        then(() => tokyWokySignIn());
};

//used for when user tries to register from a lithium hosted page
let launchSocialRegisterFlow = function () {
    Sephora.TokyWoky ? Sephora.TokyWoky.CommunitySignIn = true
        : Sephora.TokyWoky = { CommunitySignIn: true };

    //if user is registering, only option to open afterwards is
    //social registration modal, since new user will need nickname
    return showRegistrationModal().
        then(() => showSocialRegistrationModal()).
        then(() => tokyWokySignIn());
};

let community = {
    PROVIDER_TYPES,
    COMMUNITY_URLS,
    socialCheckLink,
    ensureUserIsReadyForSocialAction,
    launchSocialSignInFlow,
    launchSocialRegisterFlow
};

module.exports = community;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Community.js