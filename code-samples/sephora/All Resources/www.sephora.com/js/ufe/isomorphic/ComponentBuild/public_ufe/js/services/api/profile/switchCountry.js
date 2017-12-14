const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Switch+Country+API

function switchCountry(switchToCountry, languageCode) {
    const url = '/api/users/profile/switchCountry';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({ switchToCountry, languageCode })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = switchCountry;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/switchCountry.js