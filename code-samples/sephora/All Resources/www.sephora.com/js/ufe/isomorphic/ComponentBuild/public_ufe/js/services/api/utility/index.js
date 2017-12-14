// This module provides API call methods for Sephora Commerce Utility APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Utility+APIs

let storeLocator = require('./storeLocator');
let getAboutMeReviewQuestions = require('./getAboutMeReviewQuestions');
let updatePreviewSettings = require('./updatePreviewSettings');
let getCountryList = require('./getCountryList');
let getShippingCountryList = require('./getShippingCountryList');
let getSubscriptionCancelReasons = require('./getSubscriptionCancelReasons');
let getGiftCardBalance = require('./getGiftCardBalance');
let getStateAndCityForZipCode = require('./getStateAndCityForZipCode');
let getStateList = require('./getStateList');
let getOoyalaVideo = require('./getOoyalaVideo');
let getOoyalaVideosRelatedToProduct = require('./getOoyalaVideosRelatedToProduct');
let switchShippingCountry = require('./switchShippingCountry');

let { requestEmailNotificationForOutOfStockSku,
      requestEmailNotificationForComingSoonSku,
      cancelEmailNotificationRequest } = require('./requestEmailNotification');

module.exports = {
    storeLocator,
    getAboutMeReviewQuestions,
    updatePreviewSettings,
    getCountryList,
    getShippingCountryList,
    getSubscriptionCancelReasons,
    getGiftCardBalance,
    getStateAndCityForZipCode,
    getStateList,
    getOoyalaVideo,
    getOoyalaVideosRelatedToProduct,
    switchShippingCountry,
    requestEmailNotificationForOutOfStockSku,
    requestEmailNotificationForComingSoonSku,
    cancelEmailNotificationRequest
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/index.js