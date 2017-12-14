const refetch = require('Refetch');
const restApi = require('RestApi');


// Get State & City for Zip Code API
// https://jira.sephora.com/wiki/pages/viewpage.action?pageId=120042048

function getStateAndCityForZipCode(countryCode, zipCode) {
    let url = '/api/util/countries/' + countryCode + '/search?zipCode=' + zipCode;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getStateAndCityForZipCode;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getStateAndCityForZipCode.js