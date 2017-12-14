// This module provides API call methods for Sephora Commerce Basket APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Basket+APIs


let getSamples = require('./getSamples');
let getBasketDetails = require('./getBasketDetails');
let subscribeToPlay = require('./subscribeToPlay');
let addToCart = require('./addToCart');
let applyPromotion = require('./applyPromotion');
let updateBasket = require('./updateBasket');
let addSamplesToBasket = require('./addSamplesToBasket');
let addMsgPromotionToBasket = require('./addMsgPromotionToBasket');
let removePromotion = require('./removePromotion');
let removeSkuFromBasket = require('./removeSkuFromBasket');


module.exports = {
    getSamples,
    getBasketDetails,
    addToCart,
    applyPromotion,
    updateBasket,
    addSamplesToBasket,
    addMsgPromotionToBasket,
    removePromotion,
    removeSkuFromBasket,
    subscribeToPlay
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/index.js