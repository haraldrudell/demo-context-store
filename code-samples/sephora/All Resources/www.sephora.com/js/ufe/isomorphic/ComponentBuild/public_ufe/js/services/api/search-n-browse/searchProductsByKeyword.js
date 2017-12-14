const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Keyword+Search+API

function searchProductsByKeyword(query, page = 1, limit = 4) {
    let url = `/api/catalog/search/?type=keyword&q=${query}&` +
              `currentPage=${page}&pageSize=${limit}`;
    return refetch.fetch(url, { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = searchProductsByKeyword;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/searchProductsByKeyword.js