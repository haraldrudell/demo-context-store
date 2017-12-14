const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Credit+Card+To+Order+API


function addCreditCardToOrder(creditCardData) {
    let url = '/api/checkout/orders/creditCard';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(creditCardData)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = addCreditCardToOrder;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/creditCards/addCreditCardToOrder.js