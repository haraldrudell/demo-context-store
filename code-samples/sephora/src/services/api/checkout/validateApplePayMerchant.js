const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Merchant+Validation+ApplePay

function validateApplePayMerchant(domainName, validationUrl) {
    let url = '/api/checkout/applePay/validateMerchant';

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({
            domainName,
            validationURL: validationUrl
        })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = validateApplePayMerchant;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/validateApplePayMerchant.js