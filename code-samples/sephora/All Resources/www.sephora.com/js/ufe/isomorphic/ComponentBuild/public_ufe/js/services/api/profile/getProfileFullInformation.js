const refetch = require('Refetch');
const restApi = require('RestApi');
const urlUtils = require('utils/Url');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Profile+Full+Information


function getProfileFullInformation(profileId, options) {

    let url = `/api/users/profiles/${profileId}/full`;

    let { skipApis,
          includeApis,
          includeTargeters,
          productId,
          preferedSku } = options;

    let qsParams = {
        skipApis,
        includeApis,
        includeTargeters,
        productId,
        preferedSku
    };

    let qs = urlUtils.makeQueryString(qsParams);

    if (qs) {
        url += '?' + qs;
    }

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = getProfileFullInformation;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getProfileFullInformation.js