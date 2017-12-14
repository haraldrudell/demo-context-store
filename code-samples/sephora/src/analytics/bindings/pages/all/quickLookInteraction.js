const utils = require('analytics/utils');
const analyticsConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);

    let lastQuickLookEvent =
            utils.getMostRecentEvent(analyticsConsts.ASYNC_PAGE_LOAD);

    let attributesToAdd = {
        actionInfo: data.actionInfo,
        linkName: data.linkName,
        pageName: lastQuickLookEvent.eventInfo.attributes.pageName,
        productStrings: lastQuickLookEvent.eventInfo.attributes.productStrings,
        internalCampaign: null
    };

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: utils.removeUndefinedItems(attributesToAdd)
        }
    });

};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/quickLookInteraction.js