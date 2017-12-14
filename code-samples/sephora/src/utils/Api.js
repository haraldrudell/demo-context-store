const urlUtils = require('utils/Url');

/**
 *
 * @param method
 * @param url
 * @param body
 * @param params -
 * @param qsParams - array of nvps to be converted in to the querystring.  If multiple querystring
 * entries are needed for the same key, then the nvp should contain:  'key': [arrayOfValues]
 * @param headers
 * @param isMultiPart
 * @returns {{then, catch}}
 */
function request({
 method, url, params = {}, qsParams = {}, headers = {}, isMultiPart = false 
}) {
    let body;

    if (!url) {
        throw new Error('Url argument is required!');
    }

    if (!method) {
        throw new Error('Method argument is required!');
    }

    if (method === 'POST') {
        if (isMultiPart || typeof params === 'string') {
            body = params;
        } else {
            body = JSON.stringify(params);
        }
    }

    if (Object.keys(qsParams).length) {
        url += '?' + urlUtils.makeQueryString(qsParams);
    }

    return fetch(url, {
        method, body, headers 
    });
}

module.exports = { request };



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Api.js