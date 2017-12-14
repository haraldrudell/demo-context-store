const utils = require('analytics/utils');
const analyticsConsts = require('analytics/constants');
const deepExtend = require('deep-extend');
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);

    let existingProductString = currentEvent.eventInfo.attributes.productStrings;

    let flashSkuId = skuUtils.IDs.FLASH;

    let newProductString;

    let internalCampaign;

    let eventStrings = currentEvent.eventInfo.attributes.eventStrings;

    if (userUtils.getBiStatus() === userUtils.types.ROUGE) {
        internalCampaign = 'flash product+flash:enroll in flash';

        newProductString = existingProductString.concat('|eVar72=product');

        eventStrings.push(analyticsConsts.Event.FLASH_ROUGE_ENROLL);
    } else {
        internalCampaign = 'flash product+flash:add to basket';

        newProductString = existingProductString.concat(
        `|eVar72=product:flash,;${flashSkuId};;;;eVar26=${flashSkuId}|eVar72=product:flash`);
    }

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                actionInfo: '',
                productStrings: newProductString,
                internalCampaign,
                eventStrings
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/product/addFlashAndProductToBasket.js