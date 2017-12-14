/* eslint-disable max-len */
const apiUtil = require('utils/Api');
const cookieUtil = require('utils/Cookies');
const profileApi = require('services/api/profile');
const userUtil = require('utils/User');

//TODO: 17.6 LITHIUM_API_TOKEN_COOKIE_NAME cookie name will need to be updated
const LITHIUM_API_HOST = Sephora.configurationSettings.communitySiteHost;
const LITHIUM_API_TOKEN_COOKIE_NAME = 'lithiumSSO:sephora.qa';
const LITHIUM_SESSION_KEY_COOKIE_NAME = 'LiSESSIONID';
// Since this is not really used, commenting this for now (see authenticate method below).
// const LITHIUM_BASIC_AUTH_KEY = Sephora.configurationSettings.lithiumApi.token;
const SUCCESS_MESSAGE = 'success';
const IS_LITHIUM_ENABLED = true;
const BACKGROUND_PHOTO_DEFAULT = `https://${LITHIUM_API_HOST}/html/assets/coverphoto_default.jpg`;
const AVATAR_PHOTO_DEFAULT = `https://${LITHIUM_API_HOST}/t5/image/serverpage/avatar-name/default-avatar/avatar-theme/sephora/avatar-collection/sephora/avatar-display-size/profile/version/2`;

function _lithiumApiRequest(options) {
    if (IS_LITHIUM_ENABLED === false) {
        return Promise.reject('Lithium is disabled');
    }

    let qsParams = Object.assign({}, options.qsParams, { 'restapi.response_format': 'json' });

    let opts = Object.assign({}, options, {
        url: 'https://' + LITHIUM_API_HOST + options.url,
        headers: options.headers,
        qsParams,
        params: options.params
    });

    return apiUtil.request(opts).
        then(response => response.json()).
        then(data => {

            let result;

            // For the time being, Lithium does not maintain solid structure
            // throughout its responses. That's why we need to look through
            // them carefully to tell if one is success or not.

            // NOTE: data.response exists in authentication response.
            if (data.response && data.response.status === 'success') {
                data = data.response;
                delete data.status;
                result = data;
            } else if (data.status === 'success') {
                delete data.status;
                result = data;
            } else if (data.status === 'error') {
                result = Promise.reject(data.error);
            } else {
                console.debug('Unexpected response from Lithium', data);
                result = Promise.reject(data);
            }

            return result;

        }).catch(reason => {

            let result;

            if (reason instanceof Error && reason.message === 'Failed to fetch') {
                result = Promise.reject('cors 403');
            } else if (reason.code === 302) {
                // Object {code: 302, message: "User authentication failed."}
                result = Promise.reject('session expired');
            } else {
                result = Promise.reject(reason);
            }

            return result;
        });
}

function lithiumAuthenticatedApiRequest(options) {
    let LITHIUM_SESSION_KEY = cookieUtil.read(LITHIUM_SESSION_KEY_COOKIE_NAME);

    let qsParams = Object.assign({}, options.qsParams,
        { 'restapi.session_key': LITHIUM_SESSION_KEY }
    );

    let opts = Object.assign({}, options, { qsParams });

    return _lithiumApiRequest(opts);
}

function authenticate() {
    const LITHIUM_API_TOKEN = cookieUtil.read(LITHIUM_API_TOKEN_COOKIE_NAME);

    let opts = {
        url: '/restapi/vc/authentication/sessions/login',
        method: 'POST',

        // TODO (mykhaylo.gavrylyuk): Figure out why Lithium insisted on having
        // this. Allowing this header would result in OPTIONS request that would
        // fail with the below error.
        // --- Response to preflight request doesn't pass access control check:
        // --- No 'Access-Control-Allow-Origin' header is present on
        // --- the requested resource. Origin 'https://m-local.sephora.com' is
        // --- therefore not allowed access. If an opaque response serves your
        // --- needs, set the request's mode to 'no-cors' to fetch the resource
        // --- with CORS disabled.
        //
        //headers: {
        //    Authorization: `Basic ${LITHIUM_BASIC_AUTH_KEY}`
        //},

        qsParams: { 'sso.authentication_token': LITHIUM_API_TOKEN }
    };

    console.debug('Authenticating w/ Lithium...');

    return _lithiumApiRequest(opts).
        then(data => {
            cookieUtil.write(LITHIUM_SESSION_KEY_COOKIE_NAME, data.value.$);
        });
}

function ensureUserIsAuthenticated(apiMethod) {

    return (...args) => {
        return new Promise((resolve, reject) => {
            let retryCount = 0;
            function shoot() {
                console.debug('Shooting Lithium authed request', apiMethod.name, args);
                apiMethod(...args).
                    then(resolve).
                    catch(reason1 => {
                        console.debug('Lithium authed request failed', reason1);
                        authenticate().
                        then(() => {
                            if (retryCount < 2) {
                                retryCount += 1;
                                shoot();
                            } else {
                                reject(reason1);
                            }
                        }).
                        catch(reject);
                    });
            }

            function getSSOTokenAndTryAgain() {
                console.debug('Shooting Lithium SSO Token request', apiMethod.name, args);
                profileApi.getLithiumSSOToken(userUtil.getProfileId()).
                    then((token) => cookieUtil.write(LITHIUM_API_TOKEN_COOKIE_NAME, token)).
                    then(shoot).
                    catch(reject);
            }

            let LITHIUM_SESSION_KEY = cookieUtil.read(LITHIUM_SESSION_KEY_COOKIE_NAME);

            if (!LITHIUM_SESSION_KEY || LITHIUM_SESSION_KEY === '0') {
                authenticate().then(shoot).catch(getSSOTokenAndTryAgain);
            } else {
                shoot();
            }
        });
    };
}

function fixTyposInSocialInfoDataKeys(data) {
    let copy = Object.assign({}, data);

    copy.socialProfile = copy.social_profile;
    copy.socialProfile.aboutMe = copy.socialProfile.about_me;
    copy.socialProfile.isBeingFollowed = copy.socialProfile.is_being_followed;
    copy.socialProfile.biBadgeUrl = copy.socialProfile.sephora_bi_badge;
    copy.socialProfile.engagementBadgeUrl = copy.socialProfile.rank_badge;

    let isFeaturedConversation = copy.recent_messages.length === 0;
    copy.conversationsData = {
        isFeaturedConversation: isFeaturedConversation,
        conversations: isFeaturedConversation ? [copy.featured_message] : copy.recent_messages,
        total: copy.recent_messages.length
    };

    let isFeaturedGroups = copy.recent_groups.length === 0;
    copy.groupsData = {
        isFeaturedGroups: isFeaturedGroups,
        groups: isFeaturedGroups ? copy.featured_groups : copy.recent_groups,
        total: copy.totalgroups
    };

    delete copy.recent_messages;
    delete copy.totalgroups;
    delete copy.social_profile;
    delete copy.socialProfile.about_me;
    delete copy.socialProfile.sephora_bi_badge;
    delete copy.socialProfile.rank_badge;
    delete copy.featured_message;
    delete copy.recent_groups;
    delete copy.featured_groups;
    delete copy.socialProfile.is_being_followed;

    // Reset the avatar coordinates by removing them from the URL
    // TODO: Replace this with an API call once Lithium provides ones
    const COORDINATES_REGEX = /(\/image-coordinates)([^\?]*)/;

    if (copy.socialProfile.avatar &&
        copy.socialProfile.avatar.match(COORDINATES_REGEX)) {
        copy.socialProfile.avatar =
            copy.socialProfile.avatar.replace(COORDINATES_REGEX, '');
    }

    return copy;
}

function ensureBackgroundPhotoIsPresent(data) {
    if (!data.socialProfile.background) {
        data.socialProfile.background = BACKGROUND_PHOTO_DEFAULT;
    }
    return data;
}

let getAuthenticatedUserSocialInfo = function (userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/getuserrecentgroups',
        qsParams: { username: userNickname }
    }).
        then(data => data[`User_${userNickname}_Group_Info`]).
        then(fixTyposInSocialInfoDataKeys).
        then(ensureBackgroundPhotoIsPresent);
};

let joinOrLeaveGroup = function (groupId, action) {
    /* eslint-disable camelcase */
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/mobile.group_membership',
        qsParams: {
            group_id: groupId,
            action: action
        }
    });

};

let updateUserSocialBio = function (newBio, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/profiles/name/biography/set`,
        qsParams: { value: newBio }
    });
};

let updateUserSocialInstagram = function (newInstagram, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/settings/name/profile.instagram_url/set`,
        qsParams: { value: newInstagram }
    });
};

let updateUserSocialYoutube = function (newYoutube, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/settings/name/profile.youtube_url/set`,
        qsParams: { value: newYoutube }
    });
};

/**
 * Update the lithium user's avatar
 * @param  {String} newAvatarUrl - The url of the avatar
 * @param  {String} userNickname - The lithium user name
 * @returns {Promise}
 */
let updateUserSocialAvatar = function (newAvatarUrl, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/profiles/name/url_icon/set`,
        qsParams: { value: newAvatarUrl }
    });
};

/**
 * Update the lithium user's background image
 * @param  {} newBackgroundUrl - The url of the background image
 * @param  {String} userNickname - The lithium user name
 */
let updateUserSocialBackground = function (newBackgroundUrl, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/settings/name/profile.background_url/set`,
        qsParams: { value: newBackgroundUrl }
    });
};

/**
 * API call to get a list of the user's albums
 * @param  {String} userNickname - The lithium user name
 * @returns {Promise}
 */
let getUserAlbums = function (userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: `/restapi/v1/users/login/${userNickname}/media/albums/public`
    });
};

/**
 * API call to create a new album
 * @param  {String} userNickname - The lithium user name
 * @param  {String} title - The title of the album
 * @returns {Promise}
 */
let createAlbum = function (title) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: '/restapi/v1/media/albums/add',
        qsParams: { 'album.title': title }
    });
};

/**
 * API call to upload an image to an album
 * @param  {String} albumId - The ID of the album
 * @param  {Object} formData - Multi-part form data image
 * @returns {Promise}
 */
let uploadImageToAlbum = function (albumId, formData) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/media/albums/id/${albumId}/images/upload`,
        params: formData,
        isMultiPart: true
    });
};

/** follow a user api call
 * @param {string} user nickname of the current user using the site
 * @param {string} user nickname of the currently *viewed* user
 */
let followUser = function (currentUserNickname, userToFollowId) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${currentUserNickname}/addressbook/contacts/friends/add`,
        qsParams: { 'contacts.user': `/users/id/${userToFollowId}` }
    });
};

/** unfollow a user api call
 * @param {string} user nickname of the current user using the site
 * @param {string} user nickname of the currently *viewed* user
 */
let unfollowUser = function (currentUserNickname, userToUnfollowId) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${currentUserNickname}/addressbook/contacts/friends/remove`,
        qsParams: { 'contacts.user': `/users/id/${userToUnfollowId}` }
    });
};

function lithiumPublicApiRequest(options) {
    if (IS_LITHIUM_ENABLED === false) {
        return Promise.reject('Lithium is disabled');
    }

    let qsParams = Object.assign({}, options.qsParams, { 'restapi.response_format': 'json' });

    let opts = Object.assign({}, options, {
        url: 'https://' + LITHIUM_API_HOST + options.url,
        qsParams
    });

    return apiUtil.request(opts).
        then(response => response.json()).
        catch(reason => {
            let result;
            if (reason instanceof Error &&
                reason.message === 'Failed to fetch') {
                result = Promise.reject('cors 403');
            } else {
                result = Promise.reject();
            }
            return result;
        });
}

let getPublicUserSocialInfo = function (userNickname) {
    return lithiumPublicApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/getuserrecentgroups',
        qsParams: { username: userNickname }
    }).
        then(data => data[`User_${userNickname}_Group_Info`]).
        then(fixTyposInSocialInfoDataKeys).
        then(ensureBackgroundPhotoIsPresent);
};

let incrementUserScore = function (interactionType, incrementAmount) {
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/gamification/update_user_value',
        qsParams: {
            interaction_type: interactionType,
            increment_amount: incrementAmount
        }
    });
};

function noNicknameDataAdapter(data) {
    let copy = Object.assign({}, data);

    //once featured_groups comes back as an array
    //change this to copy.featured_groups without an array wrapper
    copy.groupsData = {
        isFeaturedGroups: true,
        groups: [copy.featured_group],
        total: 0
    };
    copy.conversationsData = {
        isFeaturedConversation: true,
        conversations: [copy.featured_message],
        total: 0
    };
    copy.totalGroups = 0;
    copy.socialProfile = {
        aboutMe: null,
        // TODO Can this be renamed into avatarUrl safely?
        avatar: AVATAR_PHOTO_DEFAULT,
        background: BACKGROUND_PHOTO_DEFAULT,
        youtube: null,
        instagram: null,
        follower: 0,
        following: 0
    };

    delete copy.featured_group;
    delete copy.featured_message;
    delete copy.user;
    delete copy.groups_joined;
    delete copy.user_message;
    return copy;
}

function getNoNicknameUserSocialInfo() {
    return _lithiumApiRequest({
        url: '/sephora/plugins/custom/sephora/sephora/mobile.richprofile',
        method: 'GET'
    }).then(data => noNicknameDataAdapter(data.profile));
}

getAuthenticatedUserSocialInfo = ensureUserIsAuthenticated(getAuthenticatedUserSocialInfo);
updateUserSocialBio = ensureUserIsAuthenticated(updateUserSocialBio);
updateUserSocialInstagram = ensureUserIsAuthenticated(updateUserSocialInstagram);
updateUserSocialYoutube = ensureUserIsAuthenticated(updateUserSocialYoutube);
joinOrLeaveGroup = ensureUserIsAuthenticated(joinOrLeaveGroup);
updateUserSocialAvatar = ensureUserIsAuthenticated(updateUserSocialAvatar);
updateUserSocialBackground = ensureUserIsAuthenticated(updateUserSocialBackground);
followUser = ensureUserIsAuthenticated(followUser);
unfollowUser = ensureUserIsAuthenticated(unfollowUser);
getUserAlbums = ensureUserIsAuthenticated(getUserAlbums);
createAlbum = ensureUserIsAuthenticated(createAlbum);
uploadImageToAlbum = ensureUserIsAuthenticated(uploadImageToAlbum);

module.exports = {
    getAuthenticatedUserSocialInfo,
    getPublicUserSocialInfo,
    joinOrLeaveGroup,
    updateUserSocialBio,
    updateUserSocialYoutube,
    updateUserSocialInstagram,
    updateUserSocialAvatar,
    updateUserSocialBackground,
    followUser,
    unfollowUser,
    getUserAlbums,
    createAlbum,
    uploadImageToAlbum,
    getNoNicknameUserSocialInfo,
    incrementUserScore,
    AVATAR_PHOTO_DEFAULT
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/Lithium.js