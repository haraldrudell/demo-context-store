const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Shipping+Address+to+Profile+API


function addShippingAddress(input) {
    let url = '/api/users/profiles/address';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(input)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addShippingAddress;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/addresses/addShippingAddress.js