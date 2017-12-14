const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Samples+API


function getSamples() {
    let url = '/api/util/samples';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getSamples;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/getSamples.js