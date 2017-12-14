const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+State+List+API


function getStateList(countryCode) {
    let url = `/api/util/countries/${countryCode}/states`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data.states);
}


module.exports = getStateList;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getStateList.js