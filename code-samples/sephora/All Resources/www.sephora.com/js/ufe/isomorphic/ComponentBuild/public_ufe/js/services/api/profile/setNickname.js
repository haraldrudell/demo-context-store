const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Nickname+API


function setNickname(nickname, provider) {
    const url = '/api/users/profile/nickname';
    let params = {
        isAcceptCommunity: true,
        nickName: nickname,
        provider
    };
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = setNickname;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/setNickname.js