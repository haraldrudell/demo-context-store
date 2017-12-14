const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Shipping+Address+on+Profile+API


function updateShippingAddress(addressData) {
    let url = '/api/users/profiles/address';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify(addressData)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = updateShippingAddress;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/addresses/updateShippingAddress.js