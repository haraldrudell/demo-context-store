const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Reservations+API


function getReservations(profileId) {
    let url = `/api/users/profiles/${profileId}/reservations`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = getReservations;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getReservations.js