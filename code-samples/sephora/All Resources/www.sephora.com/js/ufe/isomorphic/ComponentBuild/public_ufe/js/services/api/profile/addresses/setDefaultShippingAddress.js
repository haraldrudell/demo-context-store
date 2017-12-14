const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Default+Shipping+Address+on+Profile+API


function setDefaultShippingAddress(addressId) {
    let url = '/api/users/profiles/address/defaultAddress';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({ addressId })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = setDefaultShippingAddress;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/addresses/setDefaultShippingAddress.js