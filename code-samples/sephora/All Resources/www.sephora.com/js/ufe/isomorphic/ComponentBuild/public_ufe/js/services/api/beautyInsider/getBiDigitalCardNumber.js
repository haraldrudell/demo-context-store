const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Digital+Card+Number+API


function getBiDigitalCardNumber(userProfileId) {
    let url = `/api/bi/profiles/${userProfileId}/digitalCardNumber?source=other`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getBiDigitalCardNumber;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/getBiDigitalCardNumber.js