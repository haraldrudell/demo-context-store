const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(
        anaConsts.LINK_TRACKING_EVENT
    );

    let action;
    let eventStrings;

    if (data.newQty > data.oldQty) {
        action = 'Add To Basket';
        eventStrings = 'scAdd';
    } else {
        action = 'Remove From Basket';
        eventStrings = 'scRemove';
    }

    let attributes = {
        linkName: action,
        eventStrings: [eventStrings]
    };

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: attributes
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/updateBasketQuantity.js