const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Purchase+History


function getPurchaseHistory(userProfileId) {
    const url = `/api/bi/profiles/${userProfileId}/purchases`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getPurchaseHistory;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/getPurchaseHistory.js