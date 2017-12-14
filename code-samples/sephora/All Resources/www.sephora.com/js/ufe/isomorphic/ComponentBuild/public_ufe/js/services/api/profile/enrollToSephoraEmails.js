const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Sephora+Email+Subscription


function enrollToSephoraEmails(email) {
    const url = '/api/users/profile/emailSubscription';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({ email })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = enrollToSephoraEmails;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/enrollToSephoraEmails.js