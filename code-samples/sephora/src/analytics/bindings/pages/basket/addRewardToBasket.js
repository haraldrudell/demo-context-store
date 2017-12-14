const utils = require('analytics/utils');
const analyticsConsts = require('analytics/constants');
const deepExtend = require('deep-extend');
const basketUtils = require('utils/Basket');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                BI_RealTimePointStatus: basketUtils.getAvailableBiPoints(),
                BI_RewardType:  data.sku.biType
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/basket/addRewardToBasket.js