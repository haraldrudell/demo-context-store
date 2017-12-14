const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Type+Ahead+Search+API

function searchTypeAhead(query) {
    let url = `/api/catalog/search/?type=typeahead&q=${query}`;
    return refetch.fetch(url, { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = searchTypeAhead;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/searchTypeAhead.js