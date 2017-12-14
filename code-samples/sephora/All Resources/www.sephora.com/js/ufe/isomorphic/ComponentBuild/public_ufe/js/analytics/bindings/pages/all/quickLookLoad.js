const quickLookBindings = require('analytics/bindingMethods/pages/all/quickLookBindings');
const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(anaConsts.ASYNC_PAGE_LOAD);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                eventName: anaConsts.QUICK_LOOK_LOAD,
                eVar63: null,
                eventStrings: ['event24', 'event25'],
                pageName: quickLookBindings.getQuickLookPageName(data),
                pageType: 'quicklook',
                pageDetail: data.product.productId,
                world: quickLookBindings.getQuickLookWorld(data.product),
                productStrings: utils.buildSingleProductString(data.sku),
                urlWithoutQuery: null,
                internalCampaign:
                quickLookBindings.getQLInteralCampaign(data),
                featureStrings:
                quickLookBindings.getQuickLookFeatureString(data.product),
                rootContainerName: data.rootContainerName,
                productId: (data.product && data.product.productId)
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/quickLookLoad.js