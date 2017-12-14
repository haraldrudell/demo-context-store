const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Country+List+API


function getCountryList() {
    return refetch.fetch(restApi.getRestLocation('/api/util/countries'), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data.countries);
}


module.exports = getCountryList;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getCountryList.js