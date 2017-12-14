const anaConsts = require('analytics/constants');
const utils = require('analytics/utils');
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');

/**
 * Determine how to bind data for an event based on the context in the parameter
 * Common interactions preprocessed here include:
 * - Add to Basket
 * - Love / Un-Love
 * - Swatch Click
 * @param  {object} data An object containing specifics for this event
 */
module.exports = function (data) {

    const processEvent = require('analytics/processEvent');

    let addBindingMethods = function (methodsToAdd) {
        let existingMethods = (data.bindingMethods || []);

        /* Order of binding methods matters. The base method should happen first because
        ** subsequent methods extend the originals. This is why we do existing.concat(new) */
        data.bindingMethods = existingMethods.length ?
            existingMethods.concat(methodsToAdd)
            : methodsToAdd;
    };

    switch (data.context) {
        case anaConsts.QUICK_LOOK_MODAL:
            addBindingMethods([require('analytics/bindings/pages/all/quickLookInteraction')]);
            break;
        case anaConsts.CONTEXT.BASKET_SAMPLES:
            addBindingMethods([require('analytics/bindings/pages/basket/addSampleToBasket')]);
            break;
        case anaConsts.CONTEXT.BASKET_REWARDS:
            addBindingMethods([require('analytics/bindings/pages/basket/addRewardToBasket')]);
            break;
        case anaConsts.CONTEXT.BASKET_LOVES:
            addBindingMethods(function () {
                let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

                data.eventStrings = currentEvent.eventInfo.attributes.eventStrings || [];
                data.eventStrings.push(anaConsts.Event.ATB_FROM_BASKET_LOVE_CAROUSEL);

                Object.assign(currentEvent.eventInfo.attributes.eventStrings, data.eventStrings);
            });

            break;
        case anaConsts.CONTEXT.USE_IT_WITH:
            addBindingMethods(function () {
                let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
                currentEvent.eventInfo.attributes.productStrings +=
                    ('|eVar72=' + anaConsts.CONTEXT.USE_IT_WITH);
            });

            break;
        case anaConsts.CONTEXT.BASKET_PRODUCT:

            //Do special things based on which skus are being added to basket
            if (data.skuList) {
                let hasFlashSku = (function () {
                    return data.skuList.some((item) => {
                        if (item.skuId === skuUtils.IDs.FLASH) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }());

                if (hasFlashSku) {
                    addBindingMethods(
                        [require('analytics/bindings/pages/product/addFlashAndProductToBasket')]
                    );
                }
            } else {
                addBindingMethods(function () {
                    let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

                    currentEvent.eventInfo.attributes.productStrings +=
                        ('|eVar72=' + anaConsts.CONTEXT.BASKET_PRODUCT);
                });
            }

            break;
        case anaConsts.CONTEXT.ROUGE_ENROLL_FLASH:
            
            addBindingMethods(
                [require('analytics/bindings/pages/product/addFlashAndProductToBasket')]
            );
                
            break;
        case anaConsts.CONTEXT.ADD_FLASH_BASKET_BANNER:
            addBindingMethods(function () {
                let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
                currentEvent.eventInfo.attributes.actionInfo =
                    anaConsts.CAMPAIGN_STRINGS.ADD_FLASH_IN_BASKET_BANNER;
                currentEvent.eventInfo.attributes.internalCampaign =
                    anaConsts.CAMPAIGN_STRINGS.ADD_FLASH_IN_BASKET_BANNER;
                currentEvent.eventInfo.attributes.productStrings +=
                    ('|eVar72=' + anaConsts.PAGE_NAMES.BASKET);
            });
            break;
        default:

            //Do nothing
    }

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: data });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/preprocess/preprocessCommonInteractions.js