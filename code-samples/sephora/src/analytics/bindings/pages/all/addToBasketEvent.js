const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(
        anaConsts.LINK_TRACKING_EVENT
    );

    let attributes = {
        linkName: 'Add To Basket',
        actionInfo: 'Add To Basket',
        eventStrings: [anaConsts.Event.SC_ADD]
    };

    if (data.sku.rootContainerName) {
        attributes.internalCampaign =
                data.sku.rootContainerName +
                ':' + data.sku.productId +
                ':add-to-basket';
    }

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: attributes
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/addToBasketEvent.js