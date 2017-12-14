const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Shipping+Countries+List+API


function getShippingCountryList() {
    let url = '/api/util/shippingCountries';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data.countries);
}


module.exports = getShippingCountryList;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getShippingCountryList.js