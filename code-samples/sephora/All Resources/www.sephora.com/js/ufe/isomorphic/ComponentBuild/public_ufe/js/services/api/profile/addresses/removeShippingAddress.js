const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Shipping+Address+from+Profile+API


function removeShippingAddress(profileId, addressId) {
    let url = `/api/users/profiles/${profileId}/address/${addressId}`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'DELETE'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = removeShippingAddress;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/addresses/removeShippingAddress.js