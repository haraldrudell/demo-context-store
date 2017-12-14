// This module provides API call methods for Sephora Commerce
// Beauty Insider APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Beauty+Insider+APIs

let getBiPoints = require('./getBiPoints');
let getBiDigitalCardNumber = require('./getBiDigitalCardNumber');
let getBiAccountHistory = require('./getBiAccountHistory');
let createBiAccount = require('./createBiAccount');
let updateBiAccount = require('./updateBiAccount');
let getPurchaseHistory = require('./getPurchaseHistory');
let addBiRewardsToCart = require('./addBiRewardsToCart');
let removeBiRewardFromBasket = require('./removeBiRewardFromBasket');
let { getBiRewardsGroupForCheckout, getBiRewardsGroupForProfile } = require('./getBiRewardsGroup');

module.exports = {
    getBiPoints,
    getBiDigitalCardNumber,
    getBiAccountHistory,
    createBiAccount,
    updateBiAccount,
    addBiRewardsToCart,
    removeBiRewardFromBasket,
    getPurchaseHistory,
    getBiRewardsGroupForCheckout,
    getBiRewardsGroupForProfile
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/index.js