const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Switch+Shipping+Country+API


function switchShippingCountry(countryCode) {
    let url = '/api/users/profile/shippingCountry';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify({ countryCode })
    }).then(data => data.errorCode ? Promise.reject(data) : data.countries);
}


module.exports = switchShippingCountry;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/switchShippingCountry.js