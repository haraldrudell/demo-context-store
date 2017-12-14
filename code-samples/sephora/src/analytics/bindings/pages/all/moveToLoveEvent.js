const utils = require('analytics/utils');
const anaConsts = require('analytics/constants');
const deepExtend = require('deep-extend');

module.exports = function (data) {
    const currentEvent = utils.getMostRecentEvent(
        anaConsts.LINK_TRACKING_EVENT
    );

    const attributes = {
        linkName: 'love',
        eventStrings: [
            anaConsts.Event.EVENT_4,
            anaConsts.Event.EVENT_27
        ],
        productStrings: utils.buildProductStrings(data.item)
    };

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: attributes
        }
    });
};



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/all/moveToLoveEvent.js