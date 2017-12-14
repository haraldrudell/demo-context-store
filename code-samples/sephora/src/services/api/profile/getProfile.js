const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Profile+API


function getPublicProfileByNickname(nickname) {
    let url = `/api/users/profiles/${nickname}?source=public`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

function getCurrentProfileEmailSubscriptionStatus() {
    let url = '/api/users/profiles/current?propertiesToInclude=emailSubscriptionInfo';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) :
            data.emailSubscriptionInfo &&
                data.emailSubscriptionInfo.subscriptionStatus === 'SUBSCRIBED');
}

function lookupProfileByLogin(login) {
    let url = `/api/users/profiles/${login}?source=lookup`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

function getProfileForPasswordReset(profileId) {
    let url = `/api/users/profiles/${profileId}?source=resetPassword`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = {
    getPublicProfileByNickname,
    getCurrentProfileEmailSubscriptionStatus,
    lookupProfileByLogin,
    getProfileForPasswordReset
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getProfile.js