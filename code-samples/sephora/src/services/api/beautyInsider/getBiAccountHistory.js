const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Account+History

function getBiAccountHistory(profileId, offset, limit) {
    let url = `/api/bi/profiles/${profileId}/accountHistory` +
              `?offset=${offset}&limit=${limit}`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = getBiAccountHistory;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/getBiAccountHistory.js