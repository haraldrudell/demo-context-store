const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Gift+Card+Balance+API


function getGiftCardBalance(giftCardInfo) {
    return refetch.fetch(restApi.getRestLocation('/api/giftcard/balance'), {
        method: 'POST',
        body: JSON.stringify(giftCardInfo)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getGiftCardBalance;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getGiftCardBalance.js