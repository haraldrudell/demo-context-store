const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Media+Content+API

function getMediaContent(mediaId) {
    let url = `/api/catalog/media/${mediaId}?includeRegionsMap=true`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getMediaContent;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/cms/getMediaContent.js