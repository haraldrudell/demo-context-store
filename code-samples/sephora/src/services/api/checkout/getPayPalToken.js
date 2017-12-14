const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+PayPal+Token

function getPayPalToken() {
    let url = '/api/checkout/paypalToken';
    return refetch.fetch(restApi.getRestLocation(url)).
        then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = getPayPalToken;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/getPayPalToken.js