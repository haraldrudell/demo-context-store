// This module provides API call methods for Sephora Commerce Checkout APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Checkout+APIs

const getPayPalToken = require('./getPayPalToken');
const initializePayPalCheckout = require('./initializePayPalCheckout');

const getOrderDetails = require('./getOrderDetails');
const placeOrder = require('./placeOrder');

const validateApplePayMerchant = require('./validateApplePayMerchant');

const createShippingAddress = require('./addresses/createShippingAddress');
const updateShippingAddress = require('./addresses/updateShippingAddress');
const setShippingMethod = require('./addresses/setShippingMethod');
const getAvailableShippingMethods = require('./addresses/getAvailableShippingMethods');

const addCreditCardToOrder = require('./creditCards/addCreditCardToOrder');

const initializeAnonymousCheckout = require('./initializeAnonymousCheckout');
const initializeCheckout = require('./initializeCheckout');


module.exports = {

    getPayPalToken,
    initializePayPalCheckout,

    getOrderDetails,
    placeOrder,

    validateApplePayMerchant,

    createShippingAddress,
    updateShippingAddress, // doesn't appear to be used anywhere as of Wed Aug 23, 2017
    setShippingMethod,
    getAvailableShippingMethods,

    addCreditCardToOrder,

    initializeAnonymousCheckout,
    initializeCheckout
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/checkout/index.js