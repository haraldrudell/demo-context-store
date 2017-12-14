const refetch = require('Refetch').fetch;
const restApi = require('RestApi');
const communityUtils = require('utils/Community');
const store = require('Store');
const watch = require('redux-watch');

function getSocialInfo() {
    return new Promise(resolve => {
        let socialInfo = store.getState().socialInfo;
        let dataToSend = {};
        if (socialInfo.isLithiumSuccessful !== null && socialInfo.socialProfile) {
            dataToSend.engagementBadge = socialInfo.socialProfile.engagementBadgeUrl;
            dataToSend.profilePicture = socialInfo.socialProfile.avatar;
            dataToSend.biLevelBadge = socialInfo.socialProfile.biBadgeUrl;
            resolve(dataToSend);
        } else {
            let socialInfoWatch = watch(store.getState, 'socialInfo');
            store.subscribe(socialInfoWatch(info => {
                if (info.socialProfile) {
                    dataToSend.engagementBadge = info.socialProfile.engagementBadgeUrl;
                    dataToSend.profilePicture = info.socialProfile.avatar;
                    dataToSend.biLevelBadge = info.socialProfile.biBadgeUrl;
                    resolve(dataToSend);
                } else {
                    resolve(dataToSend);
                }
            }));
        }
    });
}

function getTokyWokySSOToken() {
    const url = '/api/users/profiles/tokyWokyToken';
    return new Promise((resolve, reject) => {
        getSocialInfo().then(socialInfo => {
            refetch(restApi.getRestLocation(url), {
                method: 'POST',
                body: JSON.stringify(socialInfo)
            }).then(data => {
                if (data.errorCode) {
                    reject(data);
                } else {
                    resolve(data);
                }
            });
        });
    });
}

function validateSocialUser() {
    return communityUtils.ensureUserIsReadyForSocialAction(
        communityUtils.PROVIDER_TYPES.tokywoky);
}


function getToken() {
    return new Promise((resolve, reject) => {
        Sephora.TokyWoky.isSignInThroughChat = true;
        validateSocialUser().
            then(() => getTokyWokySSOToken()).
            then(data => resolve(data)).
            catch(reject);
    });
}

module.exports = {
    getTokyWokySSOToken,
    getToken
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/tokyWoky.js