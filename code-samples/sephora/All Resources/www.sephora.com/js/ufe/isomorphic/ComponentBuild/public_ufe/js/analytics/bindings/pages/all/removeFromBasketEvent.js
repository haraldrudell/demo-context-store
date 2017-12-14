const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {

    let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                // Should anything be added to the removeFromBasket link
                // tracking event or removed from it, please do that here.
            }
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/removeFromBasketEvent.js