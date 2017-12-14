const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Preview+Settings+API


function updatePreviewSettings(params) {
    let url = '/api/util/previewSettings';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'PUT',
        body: JSON.stringify(params)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = updatePreviewSettings;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/updatePreviewSettings.js