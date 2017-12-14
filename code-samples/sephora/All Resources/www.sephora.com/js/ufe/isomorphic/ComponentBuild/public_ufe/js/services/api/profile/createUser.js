const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Create+User+API


function createUser(profileData) {
    return refetch.fetch(restApi.getRestLocation('/api/users/profile'), {
        method: 'POST',
        body: JSON.stringify(profileData)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = createUser;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/createUser.js