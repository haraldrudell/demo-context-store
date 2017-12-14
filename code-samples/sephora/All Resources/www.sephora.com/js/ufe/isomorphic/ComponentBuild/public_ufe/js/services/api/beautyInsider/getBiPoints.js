const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Points+API


function getBiPoints(userProfileId) {
    let url = `/api/bi/profiles/${userProfileId}/points?source=profile`;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getBiPoints;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/getBiPoints.js