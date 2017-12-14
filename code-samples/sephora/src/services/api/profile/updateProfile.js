const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Profile+API


function updateProfile(profileData) {
    return refetch.fetch(restApi.getRestLocation('/api/users/profile'), {
        method: 'PUT',
        body: JSON.stringify(profileData)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = updateProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/updateProfile.js