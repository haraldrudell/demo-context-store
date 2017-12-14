const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {
    let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                linkName: anaConsts.LinkData.CHECKOT_BUTTON_STANDARD,
                eventStrings: [anaConsts.Event.EVENT_71],
                actionInfo: anaConsts.LinkData.CHECKOT_BUTTON_STANDARD
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/basket/clickCheckout.js