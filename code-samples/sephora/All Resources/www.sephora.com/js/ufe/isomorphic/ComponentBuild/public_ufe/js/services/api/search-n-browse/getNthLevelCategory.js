const refetch = require('Refetch');
const urlUtils = require('utils/Url');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Nth+Level+Category+API

function getNthLevelCategory(options) {
    const {
        categoryId,
        ...opts
    } = options;

    let url = `/api/catalog/categories/${categoryId}/products`;

    if (Object.keys(opts).length) {
        url += '?' + urlUtils.makeQueryString(opts);
    }

    return refetch.fetch(url, { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getNthLevelCategory;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/getNthLevelCategory.js