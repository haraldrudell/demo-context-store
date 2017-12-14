const refetch = require('Refetch');
const restApi = require('RestApi');
const cacheConcern = require('services/api/cache');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Profile+Identifiers+API


const InputType = {
    PROFILE_ID: 'profileId',
    PUBLIC_ID: 'publicId',
    NICKNAME: 'nickName'
};

let getProfileIdentifiers = function (inputId, type) {
    let url = `/api/users/profileIdentifiers/${inputId}?type=${type}`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
};

getProfileIdentifiers =
        cacheConcern.decorate('getProfileIdentifiers', getProfileIdentifiers);


function getProfileIdentifiersByNickname(inputId) {
    return getProfileIdentifiers(inputId, InputType.NICKNAME);
}

function getProfileIdentifiersByPublicId(inputId) {
    return getProfileIdentifiers(inputId, InputType.PUBLIC_ID);
}

function getProfileIdentifiersByProfileId(inputId) {
    return getProfileIdentifiers(inputId, InputType.PROFILE_ID);
}


module.exports = {
    getProfileIdentifiersByNickname,
    getProfileIdentifiersByPublicId,
    getProfileIdentifiersByProfileId
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getProfileIdentifiers.js