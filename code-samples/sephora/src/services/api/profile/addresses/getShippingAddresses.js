const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Shipping+Addresses+from+Profile+API


function getShippingAddresses(profileId) {
    let url = `/api/users/profiles/${profileId}/addresses`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getShippingAddresses;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/addresses/getShippingAddresses.js